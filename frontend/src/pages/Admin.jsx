import React, { useEffect, useState, useRef } from "react";
import api from "../api";

export default function Admin() {
    const [weekly, setWeekly] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("schedules");

    const [autoSaveTimer, setAutoSaveTimer] = useState(null);
    const [saving, setSaving] = useState(false);
    const [savedPopup, setSavedPopup] = useState(false);
    
    const isServerUpdate = useRef(false);

    const days = [
        { short: "S", full: "Sunday" },
        { short: "M", full: "Monday" },
        { short: "T", full: "Tuesday" },
        { short: "W", full: "Wednesday" },
        { short: "T", full: "Thursday" },
        { short: "F", full: "Friday" },
        { short: "S", full: "Saturday" }
    ];

    useEffect(() => {
        fetchWeeklyAvailability();
    }, []);

    // Auto-save whenever weekly data changes (after initial load)
    useEffect(() => {
        // Don't trigger auto-save if this update came from the server
        if (!loading && !isServerUpdate.current) {
            startAutoSave();
        }
        // Reset the flag
        isServerUpdate.current = false;
    }, [weekly]);

    async function fetchWeeklyAvailability() {
        try {
            const res = await api.get("/admin/weekly");
            isServerUpdate.current = true;
            setWeekly(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    function startAutoSave() {
        if (autoSaveTimer) clearTimeout(autoSaveTimer);

        const timer = setTimeout(() => {
            saveAll();
        }, 2000);

        setAutoSaveTimer(timer);
    }

    async function saveAll() {
        setSaving(true);

        try {
            const response = await api.post("/admin/weekly/save", { weekly });
            
            // Use the data returned from the server
            if (response.data.data) {
                isServerUpdate.current = true;
                setWeekly(response.data.data);
            }

            setSaving(false);
            setSavedPopup(true);

            setTimeout(() => setSavedPopup(false), 2500);

        } catch (e) {
            setSaving(false);
            console.error("Auto-save failed", e);
        }
    }

    function addInterval(dayIndex) {
        setWeekly(prev => [
            ...prev,
            {
                id: null,
                day_of_week: dayIndex,
                start_time: "09:00",
                end_time: "17:00",
            }
        ]);
    }

    function deleteInterval(id) {
        setWeekly(prev => prev.filter(w => w.id !== id));
        if (id) api.delete(`/admin/weekly/${id}`);
    }

    function duplicateInterval(entry) {
        setWeekly(prev => [
            ...prev,
            {
                id: null,
                day_of_week: entry.day_of_week,
                start_time: entry.start_time,
                end_time: entry.end_time,
            }
        ]);
    }

    function updateEntry(dayIndex, entryIndex, field, value) {
        setWeekly(prev => {
            const updated = [...prev];
            const target = updated.filter(w => w.day_of_week === dayIndex)[entryIndex];
            target[field] = value;
            return [...updated];
        });
    }

    return (
        <>
            {/* Success Toast */}
            {savedPopup && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#10b981',
                    color: 'white',
                    padding: '14px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="white" fillOpacity="0.2" />
                        <path d="M6 10l2 2 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Your settings have been saved!
                </div>
            )}

            {/* Saving Indicator */}
            {saving && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#006bff',
                    color: 'white',
                    padding: '12px 18px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    fontSize: '14px',
                    fontWeight: '500'
                }}>
                    Saving...
                </div>
            )}

            <div className="page-container">
                {/* Header */}
                <div className="page-header">
                    <h1>Availability</h1>
                    <p>Configure times when you are available for meetings</p>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'schedules' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedules')}
                    >
                        Schedules
                    </button>
                    <button
                        className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('calendar')}
                    >
                        Calendar settings
                    </button>
                    <button
                        className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
                        onClick={() => setActiveTab('advanced')}
                    >
                        Advanced settings
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        Loading availability...
                    </div>
                ) : (
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '32px',
                        marginTop: '24px'
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#0d3b5c',
                            marginBottom: '8px'
                        }}>
                            Weekly hours
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#64748b',
                            marginBottom: '32px'
                        }}>
                            Set when you are typically available for meetings
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {days.map((day, idx) => {
                                const intervals = weekly.filter(w => w.day_of_week === idx);

                                return (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'flex-start',
                                        padding: '16px 0',
                                        borderBottom: idx < 6 ? '1px solid #f1f5f9' : 'none'
                                    }}>
                                        {/* Day Badge */}
                                        <div style={{
                                            minWidth: '100px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                background: intervals.length > 0 ? '#e6f0ff' : '#f1f5f9',
                                                color: intervals.length > 0 ? '#006bff' : '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '700',
                                                fontSize: '16px'
                                            }}>
                                                {day.short}
                                            </div>
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#475569'
                                            }}>
                                                {day.full}
                                            </span>
                                        </div>

                                        {/* Intervals */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {intervals.map((item, entryIndex) => (
                                                <div key={`${item.day_of_week}-${entryIndex}`} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}>
                                                    <input
                                                        type="time"
                                                        value={item.start_time}
                                                        onChange={(e) =>
                                                            updateEntry(idx, entryIndex, "start_time", e.target.value)
                                                        }
                                                        style={{
                                                            padding: '10px 12px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '14px',
                                                            width: '130px'
                                                        }}
                                                    />

                                                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>—</span>

                                                    <input
                                                        type="time"
                                                        value={item.end_time}
                                                        onChange={(e) =>
                                                            updateEntry(idx, entryIndex, "end_time", e.target.value)
                                                        }
                                                        style={{
                                                            padding: '10px 12px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '14px',
                                                            width: '130px'
                                                        }}
                                                    />

                                                    {/* Action Buttons */}
                                                    <button
                                                        onClick={() => duplicateInterval(item)}
                                                        style={{
                                                            padding: '8px 12px',
                                                            background: '#f8fafb',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '13px',
                                                            color: '#475569'
                                                        }}
                                                        title="Duplicate"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M4 2h6v2H4V2zm0 4h6v8H4V6z" />
                                                            <path d="M12 4v8h-2V6H6V4h6z" opacity="0.5" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => deleteInterval(item.id)}
                                                        style={{
                                                            padding: '8px 12px',
                                                            background: '#fee2e2',
                                                            border: '1px solid #fecaca',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '13px',
                                                            color: '#dc2626'
                                                        }}
                                                        title="Delete"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => addInterval(idx)}
                                                        style={{
                                                            padding: '8px 12px',
                                                            background: '#e6f0ff',
                                                            border: '1px solid #b3d7ff',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '13px',
                                                            color: '#006bff'
                                                        }}
                                                        title="Add another time slot"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}

                                            {intervals.length === 0 && (
                                                <button
                                                    onClick={() => addInterval(idx)}
                                                    style={{
                                                        padding: '10px 16px',
                                                        background: 'transparent',
                                                        border: '1px dashed #cbd5e1',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        color: '#006bff',
                                                        fontWeight: '500',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        width: 'fit-content'
                                                    }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    Add hours
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}