const express = require('express');
const router = express.Router();
const Share = require('../models/Share');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
    try {
        const { requestId, offerId, status = 'shared', feedback = '', rating = 5 } = req.body;

        if (mongoose.connection.readyState === 1) {
            const share = new Share({ requestId, offerId, status, feedback, rating });
            await share.save();
            return res.json({ share });
        }

        const share = {
            requestId,
            offerId,
            status,
            feedback,
            rating,
            createdAt: new Date().toISOString()
        };

        return res.json({ share });
    } catch (err) {
        res.status(500).json({ message: 'Sharing failed' });
    }
});

module.exports = router;
