const transporter = require("../config/configMensaje");

const sendEmailHandler = async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: "webmaster@ecuadana.com", // Reemplaza con tu correo
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ error: "Error al enviar correo" });
  }
};

module.exports = { sendEmailHandler };
