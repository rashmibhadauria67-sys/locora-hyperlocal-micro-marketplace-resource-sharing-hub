function normalize(text = '') {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
}

function scoreMatch(request, offer) {
    const requestTokens = new Set(normalize(request.title + ' ' + request.description));
    const offerTokens = new Set(normalize(offer.title + ' ' + offer.description));

    const overlap = [...requestTokens].filter((token) => offerTokens.has(token));
    const keywordScore = overlap.length;
    const locationBoost = request.location && offer.location && request.location.toLowerCase() === offer.location.toLowerCase() ? 3 : 0;
    const typeBoost = request.type && offer.type && request.type === offer.type ? 1 : 0;

    return keywordScore + locationBoost + typeBoost;
}

function findMatches(requests = [], offers = []) {
    const matches = [];

    requests.forEach((request) => {
        offers.forEach((offer) => {
            const score = scoreMatch(request, offer);
            if (score >= 3) {
                matches.push({
                    requestId: request.id,
                    offerId: offer.id,
                    score,
                    requestTitle: request.title,
                    offerTitle: offer.title,
                    reason: 'Shared keywords and location match'
                });
            }
        });
    });

    return matches.sort((a, b) => b.score - a.score);
}

module.exports = { findMatches, scoreMatch };