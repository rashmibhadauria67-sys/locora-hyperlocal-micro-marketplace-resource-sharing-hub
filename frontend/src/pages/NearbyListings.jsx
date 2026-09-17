import React, { useEffect, useState } from 'react'
import api from '../utils/api'

const sample = [
    { title: 'Drill Available to Borrow', type: 'Borrow', description: 'Cordless drill, good condition', contact: 'alice@example.com', image: '', location: 'Riverside', rating: 4.8 },
    { title: 'Homemade Pickles', type: 'Order', description: 'Fermented pickles, jar', contact: 'bob@example.com', image: '', location: 'Maple Park', rating: 5 },
    { title: 'Bike for Rent', type: 'Rent', description: 'City bike, hourly rates', contact: 'carol@example.com', image: '', location: 'Oak Street', rating: 4.5 },
    { title: 'Math Tutor Nearby', type: 'Contact', description: 'High school math tutoring', contact: 'dave@example.com', image: '', location: 'West End', rating: 4.2 }
]

function Tag({ type }) {
    const colors = {
        Borrow: 'bg-green-100 text-green-800',
        Offer: 'bg-blue-100 text-blue-800',
        Rent: 'bg-yellow-100 text-yellow-800',
        Order: 'bg-indigo-100 text-indigo-800',
        Contact: 'bg-gray-100 text-gray-800'
    }
    const cls = colors[type] || 'bg-gray-100 text-gray-800'
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>{type}</span>
}

function Card({ item }) {
    const [reviews, setReviews] = useState([])
    const [openReview, setOpenReview] = useState(false)
    const [reviewText, setReviewText] = useState('')
    const [reviewRating, setReviewRating] = useState(5)

    useEffect(() => {
        api.getReviews(item._id || item.id || item.title).then(data => setReviews(data || []))
    }, [item])

    async function submitReview(e) {
        e.preventDefault()
        const res = await api.addReview(item._id || item.id || item.title, { rating: reviewRating, comment: reviewText })
        if (res) {
            setReviews(prev => [res, ...prev])
            setReviewText('')
            setReviewRating(5)
            setOpenReview(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
            <div className="flex-1">
                {item.image ? <img src={item.image} alt={item.title} className="w-full h-36 object-cover rounded mb-3" /> : <div className="w-full h-36 rounded mb-3 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-4xl">📦</div>}
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description || item.desc}</p>
                <div className="text-xs text-gray-500 mb-2">📍 {item.location || 'Nearby'}</div>
                <div className="text-xs text-amber-600 mb-3">⭐ {Number(item.rating || 5).toFixed(1)} · {reviews.length} reviews</div>
            </div>
            <div className="mt-3 space-y-2">
                {openReview ? (
                    <form onSubmit={submitReview} className="space-y-2">
                        <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="w-full border rounded px-2 py-1 text-sm">
                            {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} star{v > 1 ? 's' : ''}</option>)}
                        </select>
                        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write a short review" className="w-full border rounded px-2 py-1 text-sm" rows="2" />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setOpenReview(false)} className="px-2 py-1 border rounded text-sm">Cancel</button>
                            <button type="submit" className="px-2 py-1 bg-emerald-600 text-white rounded text-sm">Post</button>
                        </div>
                    </form>
                ) : null}
            </div>
            <div className="mt-3 flex items-center justify-between">
                <Tag type={item.type} />
                <button onClick={() => setOpenReview(v => !v)} className="px-3 py-1 bg-white border rounded text-sm text-gray-700">Review</button>
            </div>
        </div>
    )
}

export default function NearbyListings() {
    const [items, setItems] = useState([])
    const [query, setQuery] = useState('')

    useEffect(() => {
        api.getItems().then(data => {
            if (data) setItems(data)
            else setItems(sample)
        }).catch(() => setItems(sample))
    }, [])

    const filteredItems = items.filter(item => {
        const text = `${item.title || ''} ${item.description || ''} ${item.location || ''}`.toLowerCase()
        return text.includes(query.toLowerCase())
    })

    return (
        <div>
            <section className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold text-emerald-900">Hyperlocal Resource Sharing Hub</h1>
                        <p className="mt-2 text-emerald-700">Borrow, Swap, Sell, Share — connecting neighbors and reducing waste.</p>
                        <div className="mt-4 flex gap-3">
                            <a href="/offer" className="px-4 py-2 bg-emerald-600 text-white rounded shadow">Offer an Item</a>
                            <a href="/requests" className="px-4 py-2 bg-white border rounded">Community Requests</a>
                        </div>
                    </div>
                    <div className="w-full md:w-96 grid grid-cols-1 gap-3">
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">🔧</div>
                            <div>
                                <div className="font-semibold">Lend & Borrow</div>
                                <div className="text-sm text-gray-600">Share tools, appliances, books and more</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">🍲</div>
                            <div>
                                <div className="font-semibold">Local Homemade Foods</div>
                                <div className="text-sm text-gray-600">Order tasty dishes made by neighbors</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">🤝</div>
                            <div>
                                <div className="font-semibold">Verified Neighbors</div>
                                <div className="text-sm text-gray-600">Trusted community members nearby</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mb-4">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search nearby listings" className="w-full border px-3 py-2 rounded" />
            </div>

            <div className="mb-4 bg-white rounded-lg shadow p-4">
                <div className="text-sm font-semibold mb-2">Neighborhood map preview</div>
                <div className="h-40 rounded bg-gradient-to-br from-emerald-100 via-lime-50 to-teal-100 relative overflow-hidden">
                    <div className="absolute left-5 top-8 w-24 h-16 rounded-full bg-white/50 blur-xl"></div>
                    <div className="absolute right-10 bottom-5 w-20 h-20 rounded-full bg-emerald-200/60 blur-xl"></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-emerald-700">📍 Nearby</div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Nearby Listings</h2>
            {filteredItems.length === 0 ? (
                <div className="bg-white p-6 rounded shadow text-center text-gray-600">No listings nearby. Be the first to <a href="/offer" className="text-emerald-600 font-medium">post an item</a>.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((it, idx) => <Card key={idx} item={{ title: it.title || it, description: it.description || it.desc, type: it.type || 'Contact', contact: it.contact || '', image: it.image || '', location: it.location || '', rating: it.rating || 5 }} />)}
                </div>
            )}
        </div>
    )
}
