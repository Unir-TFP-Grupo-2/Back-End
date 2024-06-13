const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY || "default_secret";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(' ')[1];

  if (!token) {
    console.log("No se proporcionó un token.");
    return res.status(403).send({
      message: "No se proporcionó un token.",
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.log("Falló la autenticación del token:", err.message);
      return res.status(401).send({
        message: "Falló la autenticación del token.",
      });
    }
    req.userId = decoded.id;
    console.log("Token verificado, userId:", req.userId);
    next();
  });
};

const isAdmin = async (req, res, next) => {
  if (req.verified !== 1) {
    return res
      .status(403)
      .json({ message: "No tienes permisos para realizar esta acción." });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
};
