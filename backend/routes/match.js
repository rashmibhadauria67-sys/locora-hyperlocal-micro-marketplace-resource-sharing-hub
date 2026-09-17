const express = require('express');
const router = express.Router();
const { findMatches } = require('../lib/matching');
const store = require('../lib/store');

router.post('/', async (req, res) => {
    try {
        const { requests = [], offers = [] } = req.body;
        const matches = findMatches(requests, offers);
        res.json({ matches });
    } catch (err) {
        res.status(500).json({ message: 'Matching failed' });
    }
});

router.get('/demo', async (req, res) => {
    try {
        const requests = await store.getRequests();
        const offers = await store.getItems();
        const matches = findMatches(requests, offers);
        res.json({ matches });
    } catch (err) {
        res.status(500).json({ message: 'Demo matching failed' });
    }
});

module.exports = router;
