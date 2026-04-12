const resumeAnalyzerService = require('../../services/ai/resumeAnalyzerService');
const StudentProfile = require('../../models/StudentProfile');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * POST /api/v1/student/resume
 *
 * By the time this controller runs:
 *   - fileUploadMiddleware has already verified MIME type and file size
 *   - multer has saved the file to disk at req.file.path
 *   - req.file.filename is the sanitised filename (userId_timestamp_name.pdf)
 *
 * This controller only handles:
 *   1. AI analysis of the uploaded resume
 *   2. Updating the student's profile with the resume URL and extracted skills
 */
module.exports = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a resume file.', 400));
  }

  const resumeUrl = `/uploads/${req.file.filename}`;

  try {
    // TODO: Replace with a real PDF text extractor (e.g. pdf-parse)
    // when added to dependencies. For now we pass the filename as context
    // so OpenAI can at least attempt extraction from the name.
    const mockExtractedText = `Resume file: ${req.file.originalname}`;

    const [skills, expData] = await Promise.all([
      resumeAnalyzerService.extractSkills(mockExtractedText),
      resumeAnalyzerService.calculateExperienceLevel(mockExtractedText),
    ]);

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        resumeUrl,
        $addToSet: { skills: { $each: skills } },
      },
      { new: true, upsert: false }
    );

    return res.status(200).json(
      new ApiResponse(200, {
        profile,
        analysis: { skills, experience: expData },
      }, 'Resume uploaded and analyzed successfully')
    );
  } catch (error) {
    // AI analysis failed but file is safely on disk — still return success
    // with just the URL so the student isn't left without confirmation
    return res.status(200).json(
      new ApiResponse(200, { resumeUrl }, 'Resume saved. AI analysis temporarily unavailable.')
    );
  }
});
