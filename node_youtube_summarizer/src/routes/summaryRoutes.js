const express = require('express');
const { query, validationResult } = require('express-validator');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

router.get('/summarize',
    [
        query('url')
            .isURL()
            .withMessage('Please provide a valid YouTube URL')
            .contains('youtube.com')
            .withMessage('URL must be from YouTube'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    summaryController.summarizeVideo
);

module.exports = router;