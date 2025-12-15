import React, { useState, useEffect } from "react";
import api from "../api";

export default function Meetings() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [showBuffers, setShowBuffers] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            console.log('Fetching bookings from /api/bookings');
            const res = await api.get("/bookings");
            console.log('Bookings received:', res.data);
            setBookings(res.data);
        } catch (e) {
            console.error('Error fetching bookings:', e);
            console.error('Status:', e.response?.status);
            console.error('Data:', e.response?.data);

            if (e.response?.status === 401) {
                alert('You need to be logged in to view meetings');
            }
        }
        setLoading(false);
    }

    // Helper function to parse booking datetime properly
    const getBookingDateTime = (booking) => {
        // Extract just the date part from ISO string (YYYY-MM-DD)
        const dateOnly = booking.date.split('T')[0];
        // Combine with time
        return new Date(`${dateOnly}T${booking.start_time}`);
    };

    const upcomingBookings = bookings.filter(b => {
        const bookingDateTime = getBookingDateTime(b);
        const now = new Date();
        console.log('Comparing:', bookingDateTime, 'vs', now, '=', bookingDateTime >= now);
        return bookingDateTime >= now;
    });

    const pastBookings = bookings.filter(b => {
        const bookingDateTime = getBookingDateTime(b);
        return bookingDateTime < new Date();
    });

    const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

    // Format time nicely (remove seconds if present)
    const formatTime = (timeString) => {
        return timeString.substring(0, 5); // "09:00:00" -> "09:00"
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1>
                    Meetings
                    <svg className="help-icon" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10 14v-4M10 6h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </h1>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-left">
                    <select className="filter-select">
                        <option>My Calendly</option>
                        <option>Team Calendar</option>
                    </select>

                    <div className="toggle-switch">
                        <span>Show buffers</span>
                        <div
                            className={`switch ${showBuffers ? 'active' : ''}`}
                            onClick={() => setShowBuffers(!showBuffers)}
                        >
                            <div className="switch-handle"></div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 6h10M6 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Filter
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`tab ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past
                </button>
                <button
                    className={`tab ${activeTab === 'date-range' ? 'active' : ''}`}
                    onClick={() => setActiveTab('date-range')}
                >
                    Date Range
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ marginLeft: 4 }}>
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Bookings List or Empty State */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    Loading meetings...
                </div>
            ) : displayBookings.length === 0 ? (
                <div className="empty-state">
                    <svg className="empty-icon" viewBox="0 0 120 120" fill="none">
                        <rect x="20" y="30" width="80" height="70" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                        <rect x="20" y="30" width="80" height="15" fill="#e2e8f0" />
                        <circle cx="60" cy="70" r="20" fill="#cbd5e1" />
                        <text x="60" y="75" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#64748b">0</text>
                        <path d="M30 45h15M30 55h20M30 65h10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    </svg>

                    <h2>No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events</h2>
                    <p>
                        {activeTab === 'upcoming' 
                            ? 'Share Event Type links to schedule events.' 
                            : 'No past meetings found.'}
                    </p>

                    <button className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="4" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M2 7h12M5 4V2M11 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        View Event Types
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                    {displayBookings.map(booking => {
                        const bookingDate = new Date(booking.date.split('T')[0]);
                        
                        return (
                            <div key={booking.id} style={{
                                background: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px'
                            }}>
                                {/* Color Bar */}
                                <div style={{
                                    width: '4px',
                                    height: '60px',
                                    background: 'linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%)',
                                    borderRadius: '4px'
                                }}></div>

                                {/* Meeting Info */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#0d3b5c',
                                        marginBottom: '6px'
                                    }}>
                                        30 Minute Meeting
                                    </h3>
                                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                                        <span>{booking.visitor_name}</span>
                                        <span style={{ margin: '0 8px' }}>•</span>
                                        <span>{booking.visitor_email}</span>
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                                        {bookingDate.toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })} at {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                    </div>
                                </div>

                                {/* Actions */}
                                <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <circle cx="8" cy="3" r="1.5" />
                                        <circle cx="8" cy="8" r="1.5" />
                                        <circle cx="8" cy="13" r="1.5" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}