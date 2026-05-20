const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { extractTextFromFile } = require("../services/extractText");
const { analyzeDocument } = require("../services/analyzeDocument");

const router = express.Router();

const uploadFolder = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, and TXT files are supported"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/analyze", upload.single("document"), async (req, res) => {
  let uploadedFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No document uploaded",
      });
    }

    uploadedFilePath = req.file.path;

    const extractedText = await extractTextFromFile(req.file);

    if (!extractedText || extractedText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error:
          "Could not extract enough readable text from this document. Please upload a clearer PDF, DOCX, or TXT file.",
      });
    }

    const analysis = await analyzeDocument(extractedText);

    return res.status(200).json({
      success: true,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      extractedTextPreview: extractedText.slice(0, 1200),
      analysis,
    });
  } catch (error) {
    console.error("Document analysis error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze document",
    });
  } finally {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }
  }
});

module.exports = router;
