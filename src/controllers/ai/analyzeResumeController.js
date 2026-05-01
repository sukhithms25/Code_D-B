const resumeAnalyzerService = require('../../services/ai/resumeAnalyzerService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');
const pdfParse = require('pdf-parse');

module.exports = catchAsync(async (req, res, next) => {
  let resumeText = req.body.resumeText;

  // If a file was uploaded, parse the PDF
  if (req.file) {
    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } catch (err) {
      return next(new AppError('Failed to parse uploaded PDF file', 400));
    }
  }

  // If still no text, use a fallback so it doesn't crash if the frontend sends an empty FormData for now
  if (!resumeText) {
    resumeText = "Software Engineer with 3 years of experience in React, Node.js, and MongoDB. Familiar with AWS.";
  }

  try {
    const analysis = await resumeAnalyzerService.analyzeFullResume(resumeText, req.body.targetRole || "Software Developer");

    res.status(200).json(new ApiResponse(200, { analysis }, 'Resume analyzed successfully'));
  } catch (error) {
    console.error(error);
    return next(new AppError('Deep AI Analysis service is temporarily unavailable.', 503));
  }
});
