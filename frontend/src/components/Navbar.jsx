import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getToken, removeToken, removeRefresh } from '../utils/auth'
import api from '../utils/api'

export default function Navbar() {
    const [authed, setAuthed] = useState(false)
    const [notifications, setNotifications] = useState([])
    const nav = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const isAuthed = !!getToken()
        setAuthed(isAuthed)

        async function loadNotifications() {
            if (!isAuthed) {
                setNotifications([])
                return
            }
            const data = await api.getNotifications()
            setNotifications(data || [])
        }
        loadNotifications()

        function handleNotificationsUpdated() {
            if (getToken()) loadNotifications()
        }

        window.addEventListener('notifications-updated', handleNotificationsUpdated)
        return () => window.removeEventListener('notifications-updated', handleNotificationsUpdated)
    }, [location])

    function logout() { removeToken(); removeRefresh(); setAuthed(false); nav('/') }

    return (
        <nav className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                        <img src="/logo.svg" alt="logo" className="w-8 h-8 object-cover rounded-full" />
                    </div>
                    <span className="font-semibold text-lg">Locora</span>
                </Link>
                <div className="space-x-4 flex items-center">
                    <Link to="/" className="hover:underline">Nearby Listings</Link>
                    <Link to="/offer" className="hover:underline">Offer an Item</Link>
                    <Link to="/requests" className="hover:underline">Community Requests</Link>
                    <Link to="/matches" className="hover:underline">Matches</Link>
                    <Link to="/notifications" className="hover:underline flex items-center gap-1">
                        <span>🔔</span>
                        <span>{notifications.filter(n => !n.read).length}</span>
                    </Link>
                    {!authed ? (
                        <>
                            <Link to="/login" className="bg-white/20 px-3 py-1 rounded">Login</Link>
                            <Link to="/signup" className="bg-white/20 px-3 py-1 rounded">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="px-2 py-1 rounded bg-white/10">Profile</Link>
                            <button onClick={logout} className="px-2 py-1 rounded bg-white/10">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
