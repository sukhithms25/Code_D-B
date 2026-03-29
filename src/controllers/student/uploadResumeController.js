const uploadService = require('../../services/file/uploadService');
const fileValidatorService = require('../../services/file/fileValidatorService');
const resumeAnalyzerService = require('../../services/ai/resumeAnalyzerService');
const StudentProfile = require('../../models/StudentProfile');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');
const path = require('path');

module.exports = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Please upload a resume file', 400));

  try {
    fileValidatorService.validateResumeFile(req.file);
    fileValidatorService.checkFileSize(req.file, process.env.MAX_FILE_SIZE || 5242880);
  } catch (err) {
    return next(new AppError(err.message, 400));
  }

  // Assuming multer parses and places the file temporarily in req.file.path
  const destination = path.join(__dirname, '../../../uploads');
  const fileName = await uploadService.saveFile(req.file, destination);

  try {
    // Basic mock text extraction since no PDF parser is installed in dependencies
    const mockExtractedText = `Content of ${req.file.originalname}`;
    
    // Process with AI
    const skills = await resumeAnalyzerService.extractSkills(mockExtractedText);
    const expData = await resumeAnalyzerService.calculateExperienceLevel(mockExtractedText);

    // Update profile
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { 
        resumeUrl: `/uploads/${fileName}`,
        $addToSet: { skills: { $each: skills } }
      },
      { new: true }
    );

    res.status(200).json(new ApiResponse(200, {
      profile,
      analysis: { skills, experience: expData }
    }, 'Resume uploaded and analyzed successfully'));
  } catch (error) {
    res.status(200).json(new ApiResponse(200, {
       resumeUrl: `/uploads/${fileName}`
    }, 'Resume saved, but analysis service failed'));
  }
});
