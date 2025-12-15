import React, { useState } from "react";
import api from "../api";

export default function BookingForm({ hostUserId, date, slot, onBooked }) {
  const [formData, setFormData] = useState({
    visitor_name: "",
    visitor_email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate end_time (30 minutes after start)
      const [hours, minutes] = slot.start_time.split(':');
      const startDate = new Date();
      startDate.setHours(parseInt(hours), parseInt(minutes), 0);
      
      const endDate = new Date(startDate.getTime() + 30 * 60000); // Add 30 minutes
      const end_time = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;

      console.log('Submitting booking...');
      
      const response = await api.post("/bookings", {
        user_id: hostUserId,
        date: date,
        start_time: slot.start_time,
        end_time: end_time,
        visitor_name: formData.visitor_name,
        visitor_email: formData.visitor_email,
      });

      console.log('Response received:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);

      // ✅ Check for success in response - handle both formats
      const isSuccess = response.data.success === true || response.status === 201;
      
      console.log('Is success?', isSuccess);
      console.log('Message:', response.data.message);
      
      if (isSuccess) {
        // ✅ Pass the message from backend
        const successMessage = response.data.message || "Booking confirmed successfully!";
        console.log('Calling onBooked with success message:', successMessage);
        
        onBooked({
          success: true,
          message: successMessage,
        });
        
        // Reset form
        setFormData({
          visitor_name: "",
          visitor_email: "",
        });
      } else {
        // Handle unexpected response format
        console.log('Unexpected response format');
        onBooked({
          success: false,
          message: response.data.message || "An unexpected error occurred.",
        });
      }
    } catch (err) {
      console.error('Booking error caught:', err);
      console.error('Error response:', err.response);
      
      // ✅ Extract error message from backend or use fallback
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors || 
                          "Failed to create booking. Please try again.";
      
      console.log('Calling onBooked with error:', errorMessage);
      
      onBooked({
        success: false,
        message: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
      });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
    },
    required: {
      color: '#dc2626',
      marginLeft: '2px',
    },
    input: {
      padding: '12px 14px',
      fontSize: '15px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.15s ease',
      fontFamily: 'inherit',
    },
    button: (disabled) => ({
      padding: '14px 24px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#ffffff',
      background: disabled ? '#9ca3af' : '#006bff',
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s ease',
      outline: 'none',
      marginTop: '8px',
    }),
    helperText: {
      fontSize: '13px',
      color: '#6b7280',
      marginTop: '4px',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label htmlFor="visitor_name" style={styles.label}>
          Your Name<span style={styles.required}>*</span>
        </label>
        <input
          id="visitor_name"
          type="text"
          value={formData.visitor_name}
          onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })}
          required
          placeholder="John Doe"
          disabled={loading}
          style={styles.input}
          onFocus={(e) => {
            e.target.style.borderColor = '#006bff';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 107, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="visitor_email" style={styles.label}>
          Your Email<span style={styles.required}>*</span>
        </label>
        <input
          id="visitor_email"
          type="email"
          value={formData.visitor_email}
          onChange={(e) => setFormData({ ...formData, visitor_email: e.target.value })}
          required
          placeholder="john@example.com"
          disabled={loading}
          style={styles.input}
          onFocus={(e) => {
            e.target.style.borderColor = '#006bff';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 107, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        />
        <div style={styles.helperText}>
          A confirmation email will be sent to this address
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={styles.button(loading)}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.background = '#0056d2';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 107, 255, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.background = '#006bff';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        {loading ? "Confirming..." : "Confirm Booking"}
      </button>
    </form>
  );
}