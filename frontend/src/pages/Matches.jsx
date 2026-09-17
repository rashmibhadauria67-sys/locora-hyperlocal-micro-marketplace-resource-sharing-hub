import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [sharing, setSharing] = useState(null);

    useEffect(() => {
        async function load() {
            const data = await api.getMatches();
            setMatches(data?.matches || []);
        }
        load();
    }, []);

    async function share(match) {
        setSharing(match.offerId);
        const res = await api.shareMatch({ requestId: match.requestId, offerId: match.offerId, status: 'shared' });
        if (res?.share) {
            try {
                await api.createNotification({
                    title: 'Match shared',
                    message: `You shared ${match.offerTitle} with ${match.requestTitle}.`
                });
                window.dispatchEvent(new Event('notifications-updated'));
            } catch (error) {
                console.error('Notification create failed', error);
            }
            setSharing(null);
            alert('Shared successfully!');
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">AI Matches</h2>
            {matches.length === 0 ? (
                <div className="bg-white p-4 rounded shadow">No matches yet.</div>
            ) : (
                <div className="space-y-3">
                    {matches.map((match, index) => (
                        <div key={index} className="bg-white p-4 rounded shadow">
                            <div className="font-semibold">{match.requestTitle}</div>
                            <div className="text-sm text-gray-600">matched with {match.offerTitle}</div>
                            <div className="text-sm text-emerald-700 mt-2">Score: {match.score} · {match.reason}</div>
                            <button onClick={() => share(match)} className="mt-3 px-3 py-1 bg-emerald-600 text-white rounded" disabled={sharing === match.offerId}>
                                {sharing === match.offerId ? 'Sharing...' : 'Share'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
