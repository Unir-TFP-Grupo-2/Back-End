const db = require("../config/db");

const createGasto = async (expenseData, retryCount = 3) => {
    try {
      console.log('Insertando gasto');
      const [result] = await global.db.query(
        "INSERT INTO gasto (user_id_gasto, group_id, amount, description) VALUES (?, ?, ?, ?)",
        [expenseData.user_id_gasto, expenseData.group_id, expenseData.amount, expenseData.description]
      );
    
      const expenseId = result.insertId;
      console.log('Gasto insertado con ID:', expenseId);
    
      console.log('Insertando pagos');
      const paymentPromises = expenseData.participants.map(userId => 
        global.db.query(
          "INSERT INTO pago (expense_id, user_id, user_id_gasto, amount) VALUES (?, ?, ?, ?)",
          [expenseId, userId, expenseData.user_id_gasto, expenseData.amount / expenseData.participants.length]
        )
      );
      await Promise.all(paymentPromises);
    
      console.log('Pagos insertados exitosamente');
    
      return { success: true, expenseId };
    } catch (error) {
      console.error(`Error en inserción: ${error} (Intento ${attempt} de ${retryCount})`);
      
      if (attempt === retryCount || error.code !== 'ER_LOCK_WAIT_TIMEOUT') {
        throw error;
      }
    }
  }


const getGastoById = async (id) => {
  const [rows] = await db.query("SELECT * FROM gasto WHERE expense_id = ?", [
    id,
  ]);
  return rows[0];
};

const getAllGastos = async () => {
  const [rows] = await db.query("SELECT * FROM gasto");
  return rows;
};

const updateGasto = async (id, updateData) => {
  const { groupId, amount, description } = updateData;
  const [result] = await db.query(
    "UPDATE gasto SET group_id = ?, amount = ?, description = ? WHERE expense_id = ?",
    [groupId, amount, description, id]
  );
  return result;
};

const deleteGasto = async (id) => {
  const [result] = await db.query("DELETE FROM gasto WHERE expense_id = ?", [
    id,
  ]);
  return result;
};

module.exports = {
  createGasto,
  getGastoById,
  getAllGastos,
  updateGasto,
  deleteGasto,
};
