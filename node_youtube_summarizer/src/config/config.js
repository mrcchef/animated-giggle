require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    openRouter: {
        apiKey: process.env.OPENROUTER_API_KEY
    }
};

module.exports = config;