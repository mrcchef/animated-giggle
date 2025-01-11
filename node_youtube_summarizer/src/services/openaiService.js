const OpenAI = require('openai');
const config = require('../config/config');
const AppError = require('../utils/AppError');

class OpenAIService {
    constructor() {
        this.openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: config.openRouter.apiKey
        });
    }

    async generateSummary(text) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "google/gemini-2.0-flash-thinking-exp:free",
                messages: [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that summarizes text concisely and effectively."
                    },
                    {
                        "role": "user",
                        "content": `Please provide a concise summary of the following text: ${text}`
                    }
                ]
            });
            return completion.choices[0].message.content;
        } catch (error) {
            throw new AppError('Failed to generate summary', 500);
        }
    }
}

module.exports = new OpenAIService();