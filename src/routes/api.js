const express = require("express");
const router = express.Router();
const gastosRouter = require("./api/gastos");
const gruposRouter = require("./api/grupos");
const pagosRouter = require("./api/pagos");
const usuariosRouter = require("./api/usuarios");
const amigosRouter = require("./api/amigos");

router.use("/gastos", gastosRouter);
router.use("/grupos", gruposRouter);
router.use("/pagos", pagosRouter);
router.use("/usuarios", usuariosRouter);
router.use("/amigos", amigosRouter);


module.exports = router;
