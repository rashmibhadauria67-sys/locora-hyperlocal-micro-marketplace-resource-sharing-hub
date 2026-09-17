import React, { useEffect, useState } from 'react'
import { getToken } from '../utils/auth'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function load() {
            const token = getToken()
            if (!token) {
                setError('Please log in to view your profile.')
                return
            }

            const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json().catch(() => null)
            if (res.ok && data?.user) {
                setUser(data.user)
            } else {
                setError(data?.message || 'Unable to load profile')
            }
        }
        load()
    }, [])

    if (error) return <div className="text-red-600 p-4 bg-white rounded shadow">{error}</div>
    if (!user) return <div className="bg-white p-4 rounded shadow">Loading...</div>

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div className="text-sm text-gray-600">Joined: {new Date(user.createdAt).toLocaleString()}</div>
        </div>
    )
}
