const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const store = require('../lib/store');

router.get('/', auth.required, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        if (mongoose.connection.readyState === 1) {
            const notes = await Notification.find({ userId }).sort({ createdAt: -1 });
            return res.json(notes);
        }
        const notes = await store.getNotifications(userId);
        return res.json(notes);
    } catch (err) {
        return res.status(500).json({ message: 'Unable to load notifications' });
    }
});

router.post('/', auth.required, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const { title, message } = req.body;
        const payload = { userId, title, message, read: false, createdAt: new Date().toISOString() };

        if (mongoose.connection.readyState === 1) {
            const note = new Notification(payload);
            await note.save();
            return res.status(201).json(note);
        }

        const note = await store.addNotification(payload);
        return res.status(201).json(note);
    } catch (err) {
        return res.status(500).json({ message: 'Unable to create notification' });
    }
});

router.patch('/:id/read', auth.required, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const note = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
            return res.json(note);
        }
        const note = await store.markNotificationRead(req.params.id);
        return res.json(note);
    } catch (err) {
        return res.status(500).json({ message: 'Unable to update notification' });
    }
});

module.exports = router;
