const test = require('node:test');
const assert = require('node:assert/strict');
const { findMatches } = require('../lib/matching');

test('finds a strong match for shared keywords and nearby location', () => {
    const requests = [{ id: 'r1', title: 'Need a pressure cooker', location: 'Downtown', description: 'For weekend cooking' }];
    const offers = [{ id: 'o1', title: 'Pressure cooker available', location: 'Downtown', description: 'Good condition' }];

    const matches = findMatches(requests, offers);

    assert.equal(matches.length, 1);
    assert.equal(matches[0].requestId, 'r1');
    assert.equal(matches[0].offerId, 'o1');
    assert.ok(matches[0].score >= 5);
});
