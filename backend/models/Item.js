const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true },
    image: { type: String, trim: true },
    contact: { type: String, trim: true },
    location: { type: String, trim: true },
    type: { type: String, enum: ['Borrow', 'Order', 'Rent', 'Contact', 'Offer'], default: 'Contact' },
    rating: { type: Number, default: 5 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

itemSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Item', itemSchema);
