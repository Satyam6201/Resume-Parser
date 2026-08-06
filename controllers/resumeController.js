const { extractTextFromPDF } = require("../services/pdfService");
const { parseResumeText } = require("../services/parserService");
const fs = require("fs");
const path = require("path");

const parseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded. Please upload a PDF file." });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const { text: rawText, profileImage } = await extractTextFromPDF(pdfBuffer);

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from PDF. Ensure it is a text-based PDF, not a scanned image." });
    }

    const parsedData = parseResumeText(rawText);
    parsedData.personalInformation.profileImage = profileImage;

    // Save JSON output
    const outputFileName = req.file.filename.replace(".pdf", ".json");
    const outputPath = path.join(__dirname, "../output", outputFileName);
    fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2));

    // Remove the original uploaded PDF to keep things clean
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn("Failed to delete temp PDF file", e);
    }

    res.json(parsedData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  parseResume,
};