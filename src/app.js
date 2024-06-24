const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");
const configMensaje = require("./config/configMensaje");

const app = express();
app.use(bodyParser.json());
app.use(cors());


// Routes
const apiRouter = require("./routes/api");
const gastosRoutes = require("./routes/api/gastos");
const pagosRoutes = require("./routes/api/pagos");
const emailRoutes = require("./routes/api/email");

app.use("/api", apiRouter);
app.use("/api/gastos", gastosRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/email", emailRoutes);

app.post("/api/sendmail", (req, res) => {
  configMensaje(req.body);
  res.status(200).send("Correo enviado");
});

// Verificar y crear la carpeta 'uploads' si no existe
const uploadsDir = path.join(__dirname, '/uploads');
console.log(uploadsDir);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configurar Express para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(uploadsDir));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo único
  }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No se subió ningún archivo.' });
  }
  const photo_url = `http://localhost:3000/uploads/${req.file.filename}`;
  res.send({ photo_url });
});

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




module.exports = app;
