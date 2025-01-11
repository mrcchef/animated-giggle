const YoutubeService = require('../services/youtubeService');
const openAIService = require('../services/openaiService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.summarizeVideo = asyncHandler(async (req, res) => {
    const { url } = req.query;

    if (!url) {
        throw new AppError('YouTube URL is required', 400);
    }

    // Get transcript
    const transcript = await YoutubeService.getTranscript(url);

    // Generate summary
    const summary = await openAIService.generateSummary(transcript);

    res.status(200).json({
        status: 'success',
        data: {
            summary
        }
    });
});