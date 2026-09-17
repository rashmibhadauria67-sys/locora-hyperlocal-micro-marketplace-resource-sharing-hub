const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Request = require('../models/Request');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const store = require('../lib/store');

router.post('/', auth.required, async (req, res) => {
    try {
        const { kind = 'request', title, description, category, image, contact, type, location } = req.body;

        if (!title || title.trim().length < 3) {
            return res.status(400).json({ message: 'Title is required (min 3 chars)' });
        }

        const ownerId = req.user?.id || req.userId;

        if (kind === 'offer' || type === 'Offer' || type === 'Borrow' || type === 'Order' || type === 'Rent') {
            const itemPayload = {
                title,
                description,
                category,
                image,
                contact,
                type: type || 'Offer',
                location,
                owner: ownerId,
            };

            if (mongoose.connection.readyState === 1) {
                const item = new Item(itemPayload);
                await item.save();
                return res.status(201).json(item);
            }

            const item = { id: Date.now().toString(), ...itemPayload, createdAt: new Date() };
            await store.addItem(item);
            return res.status(201).json(item);
        }

        const requestPayload = {
            title,
            description,
            contact,
            location,
            requester: ownerId,
        };

        if (mongoose.connection.readyState === 1) {
            const request = new Request(requestPayload);
            await request.save();
            return res.status(201).json(request);
        }

        const request = { id: Date.now().toString(), ...requestPayload, createdAt: new Date() };
        await store.addRequest(request);
        return res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: 'Posting failed' });
    }
});

module.exports = router;
