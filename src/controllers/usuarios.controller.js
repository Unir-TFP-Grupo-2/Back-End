const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmailHandler } = require("./email.controller");
const {
  createUser,
  removeGroupMember,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  groupExists,
  updateUserFields,
} = require("../models/usuario.model");
const { generateToken } = require("../helpers/utils");

const registerUser = async (req, res) => {
  const { name, lastname, email, photo, password, groupId, paymentPercentage } =
    req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const result = await createUser(
      name,
      lastname,
      email,
      photo,
      hashedPassword
    );

    if (result.insertId) {
      if (groupId) {
        const groupExistsResult = await groupExists(groupId);
        if (!groupExistsResult) {
          return res.status(400).json({ message: "El grupo no existe" });
        }
        await db.query(
          "INSERT INTO grupo_miembro (group_id, user_id, percentage) VALUES (?, ?, ?)",
          [groupId, result.insertId, paymentPercentage]
        );
      }
      res.status(201).json({ message: "Usuario registrado exitosamente" });
    } else {
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users); // Enviar la respuesta en formato JSON
  } catch (error) {
    console.error("Error al obtener los usuarios:", error); // Imprimir cualquier error en la consola
    res.status(500).json({ message: "Error al obtener los usuarios" }); // Enviar una respuesta de error
  }
};

const getUserByIdHandler = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserHandler = async (req, res) => {
  const {
    name,
    lastname,
    email,
    photo,
    password,
    group_id,
    payment_percentage,
    debt,
  } = req.body;
  const updateData = {
    name,
    lastname,
    email,
    photo,
    password,
    group_id,
    payment_percentage,
    debt,
  };

  if (password) {
    updateData.password = bcrypt.hashSync(password, 8);
  }

  try {
    const result = await updateUser(req.params.id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status[500].json({ error: error.message });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log("Usuario encontrado:", user);
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Contraseña inválida" });
    }
    const token = generateToken(user);
    if (!user.user_id) {
      return res
        .status(500)
        .json({ message: "Error interno, el ID del usuario no se encontró" });
    }
    res.status(200).json({ token, user: user.user_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addUserToGroup = async (req, res) => {
  const { groupId, paymentPercentage } = req.body;
  const userId = req.params.id;

  try {
    const groupExistsResult = await groupExists(groupId);
    if (!groupExistsResult) {
      return res.status(400).json({ message: "El grupo no existe" });
    }
    await db.query(
      "INSERT INTO grupo_miembro (group_id, user_id, percentage) VALUES (?, ?, ?)",
      [groupId, userId, paymentPercentage]
    );
    res.status(200).json({ message: "Usuario asignado al grupo exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeUserFromGroup = async (req, res) => {
  const userId = req.params.id;
  const groupId = req.params.groupId;

  try {
    await removeGroupMember(groupId, userId);
    res
      .status(200)
      .json({ message: "Usuario eliminado del grupo exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmailByUserIdHandler = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyPassword = async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.status(200).json({ message: "Contraseña verificada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const resetToken = bcrypt.hashSync(token, 8);

    // Save the token in the database with an expiration time
    await updateUserFields(user.user_id, {
      reset_token: resetToken,
      reset_token_expiration: new Date(Date.now() + 3600000), // 1 hour
    });

    // enviar email con link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&id=${user.user_id}`;
    const mailOptions = {
      from: "webmaster@ecuadana.com",
      to: user.email,
      subject: "Password Reset",
      text: `Solicitaste un restablecimiento de contraseña. Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`,
    };

    await sendEmailHandler({ body: mailOptions }, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, id, newPassword } = req.body;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const tokenIsValid = bcrypt.compareSync(token, user.reset_token);
    if (!tokenIsValid || Date.now() > new Date(user.reset_token_expiration)) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    await updateUserFields(user.user_id, {
      password: hashedPassword,
      reset_token: null,
      reset_token_expiration: null,
    });

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  registerUser,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
  loginUser,
  addUserToGroup,
  removeUserFromGroup,
  getEmailByUserIdHandler,
  verifyPassword,
  requestPasswordReset,
  resetPassword,
};
