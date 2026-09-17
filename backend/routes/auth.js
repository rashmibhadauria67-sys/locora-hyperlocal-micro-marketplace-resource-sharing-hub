const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const store = require('../lib/store');

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
        if (mongoose.connection.readyState === 1) {
            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ message: 'Email already in use' });
            const hashed = await bcrypt.hash(password, 10);
            const user = new User({ name, email, password: hashed });
            await user.save();
            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1h' });
            const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
            const refreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
            user.refreshTokens = user.refreshTokens || [];
            user.refreshTokens.push(refreshToken);
            await user.save();
            return res.json({ token: accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
        }
        const existing = await store.findUserByEmail(email);
        if (existing) return res.status(400).json({ message: 'Email already in use' });
        const hashed = await bcrypt.hash(password, 10);
        const user = { id: Date.now().toString(), name, email, password: hashed, refreshTokens: [], createdAt: new Date() };
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1h' });
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
        const refreshToken = jwt.sign({ id: user.id }, refreshSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
        user.refreshTokens.push(refreshToken);
        await store.addUser(user);
        res.json({ token: accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (mongoose.connection.readyState === 1) {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: 'Invalid credentials' });
            const ok = await bcrypt.compare(password, user.password);
            if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1h' });
            const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
            const refreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
            user.refreshTokens = user.refreshTokens || [];
            user.refreshTokens.push(refreshToken);
            await user.save();
            return res.json({ token: accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
        }
        const user = await store.findUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1h' });
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
        const refreshToken = jwt.sign({ id: user.id }, refreshSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push(refreshToken);
        await store.updateUser(user.id, user);
        res.json({ token: accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
        let payload;
        try { payload = jwt.verify(refreshToken, refreshSecret); } catch (err) { return res.status(401).json({ message: 'Invalid refresh token' }); }
        const userId = payload.id;
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(userId);
            if (!user) return res.status(401).json({ message: 'Invalid token' });
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) return res.status(401).json({ message: 'Refresh token not recognized' });
            // rotate
            user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
            const newRefresh = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
            user.refreshTokens.push(newRefresh);
            await user.save();
            const newAccess = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1h' });
            return res.json({ token: newAccess, refreshToken: newRefresh });
        }
        const user = await store.findUserById(userId);
        if (!user) return res.status(401).json({ message: 'Invalid token' });
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) return res.status(401).json({ message: 'Refresh token not recognized' });
        await store.removeRefreshTokenFromUser(userId, refreshToken);
        const newRefresh = jwt.sign({ id: userId }, refreshSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
        await store.addRefreshTokenToUser(userId, newRefresh);
        const newAccess = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1h' });
        res.json({ token: newAccess, refreshToken: newRefresh });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
        let payload;
        try { payload = jwt.decode(refreshToken); } catch (err) { return res.status(400).json({ message: 'Invalid token' }); }
        const userId = payload && payload.id;
        if (!userId) return res.status(400).json({ message: 'Invalid token' });
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(userId);
            if (user && user.refreshTokens) {
                user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
                await user.save();
            }
        } else {
            await store.removeRefreshTokenFromUser(userId, refreshToken);
        }
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/auth/me
router.get('/me', auth.required, async (req, res) => {
    try {
        if (req.user) return res.json({ user: req.user });
        // fallback: try DB or file store
        if (req.userId) {
            if (typeof req.userId === 'string') {
                const u = await User.findById(req.userId).select('-password').lean().catch(() => null);
                if (u) return res.json({ user: u });
                const uf = await store.findUserById(req.userId).catch(() => null);
                if (uf) return res.json({ user: uf });
            }
        }
        res.status(404).json({ message: 'User not found' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

