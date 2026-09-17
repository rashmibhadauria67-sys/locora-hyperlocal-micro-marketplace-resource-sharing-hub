import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadNotifications() {
        setLoading(true);
        const data = await api.getNotifications();
        setNotifications(data || []);
        setLoading(false);
    }

    useEffect(() => {
        loadNotifications();

        function onUpdated() {
            loadNotifications();
        }

        window.addEventListener('notifications-updated', onUpdated);
        return () => window.removeEventListener('notifications-updated', onUpdated);
    }, []);

    async function markRead(id) {
        await api.markNotificationRead(id);
        setNotifications(list => list.map(n => (n.id === id || n._id === id ? { ...n, read: true } : n)));
        window.dispatchEvent(new Event('notifications-updated'));
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Notifications</h2>
                <span className="text-sm text-gray-600">{notifications.filter(n => !n.read).length} unread</span>
            </div>

            {loading ? (
                <div className="bg-white p-4 rounded shadow">Loading notifications...</div>
            ) : notifications.length === 0 ? (
                <div className="bg-white p-4 rounded shadow">No notifications yet.</div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => {
                        const id = n.id || n._id;
                        return (
                            <div key={id} className={`bg-white p-4 rounded shadow border ${n.read ? 'border-gray-200' : 'border-emerald-300'}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-semibold">{n.title}</div>
                                        <div className="text-sm text-gray-600">{n.message}</div>
                                        <div className="text-xs text-gray-400 mt-2">
                                            {new Date(n.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    {!n.read && (
                                        <button onClick={() => markRead(id)} className="px-3 py-1 rounded bg-emerald-600 text-white text-sm">
                                            Mark read
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
