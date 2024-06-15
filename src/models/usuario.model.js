//const db = require('../config/db');

const createUser = async (name, lastname, email, photo, hashedPassword) => {
  const [result] = await db.query(
    "INSERT INTO usuario (name, lastname, email, photo, password, verified) VALUES (?, ?, ?, ?, ?, 0)",
    [name, lastname, email, photo, hashedPassword]
  );
  return result;
};



const removeGroupMember = async (groupId, userId) => {
  const [result] = await db.query(
    "DELETE FROM grupo_miembro WHERE group_id = ? AND user_id = ?",
    [groupId, userId]
  );
  return result;
};

const getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM usuario");
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM usuario WHERE user_id = ?", [
    id,
  ]);
  return rows[0];
};

const updateUser = async (id, updateData) => {
  const {
    name,
    lastname,
    email,
    photo,
    password,
    group_id,
    payment_percentage,
    debt,
  } = updateData;
  let query =
    "UPDATE usuario SET name = ?, lastname = ?, email = ?, photo = ? WHERE user_id = ?";
  let updateFields = [name, lastname, email, photo, id];

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 8);
    query =
      "UPDATE usuario SET name = ?, lastname = ?, email = ?, photo = ?, password = ? WHERE user_id = ?";
    updateFields = [name, lastname, email, photo, hashedPassword, id];
  }

  const [result] = await db.query(query, updateFields);
  return result;
};

const deleteUser = async (id) => {
  const [result] = await db.query("DELETE FROM usuario WHERE user_id = ?", [
    id,
  ]);
  return result;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

const groupExists = async (groupId) => {
  const [rows] = await db.query("SELECT * FROM grupo WHERE group_id = ?", [
    groupId,
  ]);
  return rows.length > 0;
};

module.exports = {
  createUser,
  removeGroupMember,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  groupExists,
};
