const {
  createGasto,
  getGastoById,
  getAllGastos,
  updateGasto,
  deleteGasto,
} = require("../models/gasto.model");

const createGastoHandler = async (req, res) => {
  const { groupId, amount, description } = req.body;

  try {
    const result = await createGasto(groupId, amount, description);
    res
      .status(201)
      .json({ message: "Gasto creado exitosamente", gastoId: result.insertId });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
};

const getGastoByIdHandler = async (req, res) => {
  try {
    const gasto = await getGastoById(req.params.id);
    if (!gasto) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }
    res.status(200).json(gasto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllGastosHandler = async (req, res) => {
  try {
    const gastos = await getAllGastos();
    res.status(200).json(gastos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGastoHandler = async (req, res) => {
  const { groupId, amount, description } = req.body;

  try {
    const result = await updateGasto(req.params.id, {
      groupId,
      amount,
      description,
    });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }
    res.status(200).json({ message: "Gasto actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGastoHandler = async (req, res) => {
  try {
    const result = await deleteGasto(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }
    res.status(200).json({ message: "Gasto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createGastoHandler,
  getGastoByIdHandler,
  getAllGastosHandler,
  updateGastoHandler,
  deleteGastoHandler,
};
