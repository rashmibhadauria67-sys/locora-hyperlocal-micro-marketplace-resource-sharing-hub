import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NearbyListings from './pages/NearbyListings'
import OfferItem from './pages/OfferItem'
import CommunityRequests from './pages/CommunityRequests'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Matches from './pages/Matches'
import Notifications from './pages/Notifications'
import RequireAuth from './components/RequireAuth'
import GitHubSubmissionPage from './pages/GitHubSubmissionPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/submission" element={<GitHubSubmissionPage />} />
                <Route path="/*" element={
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
                            <Routes>
                                <Route path="/" element={<NearbyListings />} />
                                <Route path="/offer" element={<OfferItem />} />
                                <Route path="/requests" element={<CommunityRequests />} />
                                <Route path="/matches" element={<RequireAuth><Matches /></RequireAuth>} />
                                <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    )
}
