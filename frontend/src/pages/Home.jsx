import React, { useEffect, useState } from "react";
import api from "../api";
import { format, addDays } from "date-fns";
import BookingForm from "../components/BookingForm";

export default function Schedule() {
  // Get the host user_id from URL params (e.g., /schedule/1)
  // Or from your routing setup
  const hostUserId = 1; // TODO: Get this from route params or props

  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState(null);
  const [hostInfo, setHostInfo] = useState({ name: "Klinton A", initial: "K" });

  useEffect(() => {
    fetchSlots(date);
  }, [date]);

  async function fetchSlots(d) {
    setMessage(null);
    setLoadingSlots(true);
    try {
      // Pass the host's user_id to get their availability
      const res = await api.get("/availability", { 
        params: { 
          date: d,
          user_id: hostUserId // The person being booked
        } 
      });
      setSlots(res.data.slots || []);
    } catch (err) {
      console.error(err);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
      setSelected(null);
    }
  }

  const generateWeekDates = () => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => addDays(today, i));
  };

  const weekDates = generateWeekDates();

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      borderBottom: '1px solid #e5e7eb',
      padding: '20px 40px',
      background: '#ffffff',
    },
    headerContent: {
      maxWidth: '1100px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      fontSize: '20px',
      flexShrink: 0,
    },
    headerText: {
      flex: 1,
    },
    ownerName: {
      fontSize: '13px',
      color: '#6b7280',
      fontWeight: '500',
      marginBottom: '2px',
    },
    meetingTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
    },
    mainContent: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '40px 40px 80px',
      display: 'flex',
      gap: '40px',
    },
    leftPanel: {
      flex: '0 0 380px',
      background: '#ffffff',
      borderRadius: '12px',
      padding: '32px',
      height: 'fit-content',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    rightPanel: {
      flex: 1,
      background: '#ffffff',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      minHeight: '500px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '20px',
    },
    weekGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '6px',
      marginBottom: '20px',
    },
    dateButton: (isSelected, isToday) => ({
      padding: '10px 4px',
      borderRadius: '8px',
      border: isSelected ? '2px solid #006bff' : '1px solid #e5e7eb',
      background: isSelected ? '#f0f7ff' : '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px',
      transition: 'all 0.15s ease',
      outline: 'none',
    }),
    dayLabel: (isSelected) => ({
      fontSize: '11px',
      fontWeight: '600',
      color: isSelected ? '#006bff' : '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }),
    dayNumber: (isSelected) => ({
      fontSize: '20px',
      fontWeight: '700',
      color: isSelected ? '#006bff' : '#111827',
      lineHeight: '1',
    }),
    todayDot: {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: '#006bff',
      marginTop: '2px',
    },
    timezoneInfo: {
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      paddingBottom: '20px',
      borderBottom: '1px solid #f3f4f6',
    },
    dateHeader: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
    },
    slotsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxHeight: '400px',
      overflowY: 'auto',
      paddingRight: '4px',
    },
    slotButton: (isBooked, isSelectedSlot) => ({
      padding: '14px 20px',
      borderRadius: '8px',
      border: isBooked ? '1px solid #fca5a5' : (isSelectedSlot ? '2px solid #006bff' : '1px solid #e5e7eb'),
      background: isBooked ? '#fee2e2' : (isSelectedSlot ? '#f0f7ff' : '#ffffff'),
      cursor: isBooked ? 'not-allowed' : 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      color: isBooked ? '#dc2626' : (isSelectedSlot ? '#006bff' : '#374151'),
      transition: 'all 0.15s ease',
      textAlign: 'left',
      textDecoration: isBooked ? 'line-through' : 'none',
      outline: 'none',
      opacity: isBooked ? 0.8 : 1,
      position: 'relative',
    }),
    emptyState: {
      padding: '40px 20px',
      textAlign: 'center',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
      color: '#9ca3af',
      fontSize: '14px',
    },
    bookingCard: {
      marginBottom: '28px',
      paddingBottom: '24px',
      borderBottom: '1px solid #f3f4f6',
    },
    bookingLabel: {
      fontSize: '11px',
      color: '#6b7280',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      marginBottom: '12px',
    },
    bookingTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '12px',
    },
    bookingDetails: {
      fontSize: '14px',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      lineHeight: '1.5',
    },
    emptyRightPanel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      color: '#9ca3af',
      fontSize: '15px',
      textAlign: 'center',
    },
    messageBox: (type) => ({
      marginTop: '20px',
      padding: '14px 18px',
      borderRadius: '8px',
      background: type === "success" ? "#ecfdf5" : "#fef2f2",
      border: type === "success" ? "1px solid #a7f3d0" : "1px solid #fecaca",
      fontSize: '14px',
    }),
    messageTitle: (type) => ({
      fontWeight: '600',
      color: type === "success" ? "#065f46" : "#991b1b",
      marginBottom: '6px',
    }),
    messageText: (type) => ({
      color: type === "success" ? "#047857" : "#dc2626",
      lineHeight: '1.5',
    }),
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.avatar}>{hostInfo.initial}</div>
          <div style={styles.headerText}>
            <div style={styles.ownerName}>{hostInfo.name}</div>
            <h1 style={styles.meetingTitle}>30 Minute Meeting</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <h3 style={styles.sectionTitle}>Select a Date & Time</h3>

          {/* Week 1 */}
          <div style={styles.weekGrid}>
            {weekDates.slice(0, 7).map((d) => {
              const dateStr = format(d, "yyyy-MM-dd");
              const isSelected = dateStr === date;
              const isToday = format(new Date(), "yyyy-MM-dd") === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setDate(dateStr)}
                  style={styles.dateButton(isSelected, isToday)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.background = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.background = '#ffffff';
                    }
                  }}
                >
                  <div style={styles.dayLabel(isSelected)}>
                    {format(d, "EEE")}
                  </div>
                  <div style={styles.dayNumber(isSelected)}>
                    {format(d, "d")}
                  </div>
                  {isToday && <div style={styles.todayDot}></div>}
                </button>
              );
            })}
          </div>

          {/* Week 2 */}
          <div style={styles.weekGrid}>
            {weekDates.slice(7, 14).map((d) => {
              const dateStr = format(d, "yyyy-MM-dd");
              const isSelected = dateStr === date;

              return (
                <button
                  key={dateStr}
                  onClick={() => setDate(dateStr)}
                  style={styles.dateButton(isSelected, false)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.background = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.background = '#ffffff';
                    }
                  }}
                >
                  <div style={styles.dayLabel(isSelected)}>
                    {format(d, "EEE")}
                  </div>
                  <div style={styles.dayNumber(isSelected)}>
                    {format(d, "d")}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Timezone */}
          <div style={styles.timezoneInfo}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>

          {/* Available Times */}
          <div>
            <div style={styles.dateHeader}>
              {format(new Date(date), "EEEE, MMMM d")}
            </div>

            {loadingSlots ? (
              <div style={styles.emptyState}>Loading available times...</div>
            ) : null}

            {!loadingSlots && slots.length === 0 && (
              <div style={styles.emptyState}>
                No available times for this date
                <div style={{fontSize: '12px', marginTop: '8px', color: '#6b7280'}}>
                  The host has not set availability for this day
                </div>
              </div>
            )}

            {!loadingSlots && slots.length > 0 && (
              <div style={styles.slotsGrid}>
                {slots.map((s) => {
                  const isBooked = s.status === "booked";
                  const isSelectedSlot = selected && selected.start_time === s.start_time;
                  
                  return (
                    <button
                      key={s.start_time}
                      disabled={isBooked}
                      onClick={() => !isBooked && setSelected(s)}
                      style={styles.slotButton(isBooked, isSelectedSlot)}
                      onMouseEnter={(e) => {
                        if (!isBooked && !isSelectedSlot) {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.background = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isBooked && !isSelectedSlot) {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.background = '#ffffff';
                        }
                      }}
                    >
                      {/* Format time nicely (remove seconds if present) */}
                      {s.start_time.substring(0, 5)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          {!selected ? (
            <div style={styles.emptyRightPanel}>
              <div>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{margin: '0 auto 16px'}}>
                  <circle cx="24" cy="24" r="20" stroke="#e5e7eb" strokeWidth="2"/>
                  <path d="M24 14v10l6 4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>Select a time slot to continue</div>
              </div>
            </div>
          ) : (
            <>
              <div style={styles.bookingCard}>
                <div style={styles.bookingLabel}>Enter Details</div>
                <div style={styles.bookingTitle}>30 Minute Meeting</div>
                <div style={styles.bookingDetails}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{flexShrink: 0, marginTop: '2px'}}>
                    <rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 7h12M6 3v3M12 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>
                    {format(new Date(date), "EEEE, MMMM d, yyyy")} at {selected.start_time.substring(0, 5)}
                  </span>
                </div>
              </div>

              <BookingForm
                hostUserId={hostUserId}
                date={date}
                slot={selected}
                onBooked={(result) => {
                  if (result.success) {
                    setMessage({type: "success", text: result.message});
                    fetchSlots(date);
                    setSelected(null);
                  } else {
                    setMessage({type: "error", text: result.message});
                  }
                }}
              />

              {message && (
                <div style={styles.messageBox(message.type)}>
                  <div style={styles.messageTitle(message.type)}>
                    {message.type === "success" ? "Success!" : "Error"}
                  </div>
                  <div style={styles.messageText(message.type)}>
                    {message.text}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}