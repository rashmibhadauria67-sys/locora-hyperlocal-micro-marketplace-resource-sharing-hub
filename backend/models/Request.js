const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    contact: { type: String, trim: true },
    location: { type: String, trim: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
