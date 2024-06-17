const bcrypt = require("bcryptjs");
const {
  createUser,
  addGroupMember,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  groupExists,
  removeGroupMember,
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
        await addGroupMember(groupId, result.insertId, paymentPercentage);
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
    const { groupId } = req.params;  // Extraer groupId de los parámetros de la URL
    console.log(groupId);  // Imprimir el groupId para depuración
    const users = await getAllUsersByGroupId(groupId);  // Llamar a la función para obtener los usuarios
    res.json(users);  // Enviar la respuesta en formato JSON
  } catch (error) {
    console.error(error);  // Imprimir cualquier error en la consola
    res.status(500).json({ message: 'Error al obtener los usuarios del grupo' });  // Enviar una respuesta de error
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
    res.status(500).json({ error: error.message });
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
      return res.status(500).json({ message: "Error interno, el ID del usuario no se encontró" });
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
    await addGroupMember(groupId, userId, paymentPercentage);
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

module.exports = {
  registerUser,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
  loginUser,
  addUserToGroup,
  removeUserFromGroup,
};
