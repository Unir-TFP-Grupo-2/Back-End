const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.ecuadana.com", // Reemplaza con tu servidor SMTP
  port: 587,
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: "webmaster@ecuadana.com", // Reemplaza con tu correo
    pass: "Usuario123*", // Reemplaza con tu contraseña
  },
});

module.exports = transporter;
