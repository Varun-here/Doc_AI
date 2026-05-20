const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load .env before importing routes/services
dotenv.config();

const documentRoutes = require("./routes/documentRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "DocuFlow AI backend is running",
    status: "OK",
  });
});

app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DocuFlow AI backend running on port ${PORT}`);
});
