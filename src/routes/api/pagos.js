const express = require("express");
const router = express.Router();
const pagoController = require("../../controllers/pagos.controller");

router.post("/", pagoController.createPago);
router.get("/", pagoController.getAllPagos);
router.get("/:id", pagoController.getPagoById);
router.put("/:id", pagoController.updatePago);
router.delete("/:id", pagoController.deletePago);

module.exports = router;
