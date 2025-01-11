const { YoutubeTranscript } = require('youtube-transcript');
const AppError = require('../utils/AppError');

class YoutubeService {
    static async getTranscript(url) {
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(url);
            const fullText = transcript.map(entry => entry.text).join(' ');
            return fullText;
        } catch (error) {
            throw new AppError('Failed to fetch YouTube transcript', 400);
        }
    }
}

module.exports = YoutubeService;