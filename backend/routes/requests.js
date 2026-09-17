const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const store = require('../lib/store');

// GET /api/requests
router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const reqs = await Request.find().sort({ createdAt: -1 });
            return res.json(reqs);
        }
        const reqs = await store.getRequests();
        res.json(reqs.reverse());
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/requests (requires auth)
router.post('/', auth.required, async (req, res) => {
    try {
        const { title, description, contact } = req.body;
        if (!title || title.trim().length < 3) return res.status(400).json({ message: 'Title is required (min 3 chars)' });
        if (mongoose.connection.readyState === 1) {
            const request = new Request({ title, description, contact });
            await request.save();
            return res.status(201).json(request);
        }
        const request = { id: Date.now().toString(), title, description, contact, createdAt: new Date() };
        await store.addRequest(request);
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
