//const db = require("../config/db");

const createPago = async (expenseId, userId, amount) => {
  const [result] = await db.query(
    "INSERT INTO pago (expense_id, user_id, amount) VALUES (?, ?, ?)",
    [expenseId, userId, amount]
  );
  return result;
};

const getPagoById = async (id) => {
  const [rows] = await db.query("SELECT * FROM pago WHERE payment_id = ?", [
    id,
  ]);
  return rows[0];
};

const getAllPagos = async () => {
  const [rows] = await db.query("SELECT * FROM pago");
  return rows;
};

const updatePago = async (id, updateData) => {
  const { expenseId, userId, amount } = updateData;
  const [result] = await db.query(
    "UPDATE pago SET expense_id = ?, user_id = ?, amount = ? WHERE payment_id = ?",
    [expenseId, userId, amount, id]
  );
  return result;
};

const deletePago = async (id) => {
  const [result] = await db.query("DELETE FROM pago WHERE payment_id = ?", [
    id,
  ]);
  return result;
};

const getPagosByUser = async (userId) => {
  const [rows] = await db.query("SELECT * FROM pago WHERE user_id = ?", [
    userId,
  ]);
  return rows;
};

module.exports = {
  createPago,
  getPagoById,
  getAllPagos,
  updatePago,
  deletePago,
  getPagosByUser,
};
