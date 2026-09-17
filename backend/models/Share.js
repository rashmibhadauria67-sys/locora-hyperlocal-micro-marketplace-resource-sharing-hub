const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
    requestId: { type: String, required: true, trim: true },
    offerId: { type: String, required: true, trim: true },
    status: { type: String, default: 'shared' },
    feedback: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Share', shareSchema);
