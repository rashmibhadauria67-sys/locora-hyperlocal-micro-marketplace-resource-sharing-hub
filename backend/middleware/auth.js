const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const store = require('../lib/store');
const User = require('../models/User');

async function attachUserFromPayload(req, payload) {
    if (!payload || !payload.id) return;
    req.userId = payload.id;
    try {
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(payload.id).select('-password');
            if (user) req.user = user;
        } else {
            const user = await store.findUserById(payload.id);
            if (user) req.user = user;
        }
    } catch (err) {
        // ignore retrieval errors
    }
}

exports.required = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization required' });
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        await attachUserFromPayload(req, payload);
        return next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.optional = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        await attachUserFromPayload(req, payload);
    } catch (err) {
        // ignore
    }
    next();
};
