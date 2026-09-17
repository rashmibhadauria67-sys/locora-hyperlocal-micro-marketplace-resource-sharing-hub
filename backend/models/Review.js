const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    itemId: { type: String, required: true, trim: true },
    reviewerName: { type: String, trim: true, default: 'Neighbor' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    comment: { type: String, trim: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
