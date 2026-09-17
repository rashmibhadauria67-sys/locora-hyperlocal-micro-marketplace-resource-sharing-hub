const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const store = require('../lib/store');

router.get('/:itemId', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const reviews = await Review.find({ itemId: req.params.itemId }).sort({ createdAt: -1 });
            return res.json(reviews);
        }
        const reviews = await store.getReviews(req.params.itemId);
        return res.json(reviews);
    } catch (err) {
        return res.status(500).json({ message: 'Unable to load reviews' });
    }
});

router.post('/:itemId', auth.required, async (req, res) => {
    try {
        const { rating = 5, comment = '' } = req.body;
        const reviewPayload = {
            itemId: req.params.itemId,
            reviewerName: req.user?.name || 'Neighbor',
            reviewerId: req.user?.id || req.userId,
            rating,
            comment,
            createdAt: new Date().toISOString(),
        };

        if (mongoose.connection.readyState === 1) {
            const review = new Review(reviewPayload);
            await review.save();
            return res.status(201).json(review);
        }

        const review = await store.addReview(reviewPayload);
        return res.status(201).json(review);
    } catch (err) {
        return res.status(500).json({ message: 'Unable to save review' });
    }
});

module.exports = router;
