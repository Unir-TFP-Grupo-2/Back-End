const express = require("express");
const router = express.Router();
const amigosController = require("../../controllers/amigos.controller");
const { verifyToken } = require("../../helpers/middlewares");

router.post("/", verifyToken, amigosController.createAmigoHandler);
router.get("/", verifyToken, amigosController.getFriendsHandler);
router.delete("/:friendId", verifyToken, amigosController.deleteAmigoHandler);

module.exports = router;
