const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const store = require('../lib/store');

// GET /api/items
router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const items = await Item.find().sort({ createdAt: -1 });
            return res.json(items);
        }
        const items = await store.getItems();
        res.json(items.reverse());
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/items (requires auth)
router.post('/', auth.required, async (req, res) => {
    try {
        const { title, description, category, image, contact, type } = req.body;
        if (!title || title.trim().length < 3) return res.status(400).json({ message: 'Title is required (min 3 chars)' });
        if (mongoose.connection.readyState === 1) {
            const item = new Item({ title, description, category, image, contact, type });
            await item.save();
            return res.status(201).json(item);
        }
        const item = { id: Date.now().toString(), title, description, category, image, contact, type, createdAt: new Date() };
        await store.addItem(item);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
