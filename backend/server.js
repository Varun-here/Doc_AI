const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const documentRoutes = require("./routes/documentRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://doc-ai-max.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "DocuFlow AI backend is running",
    status: "OK",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Backend health check passed",
    status: "OK",
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
  });
});

app.use("/api/documents", documentRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled backend error:", err);

  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`DocuFlow AI backend running on port ${PORT}`);
  });
}

module.exports = app;
