<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Booking Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f8fafc; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
        
        <h2 style="color:#0f172a;">Your meeting is confirmed 🎉</h2>

        <p>Hi {{ $booking->visitor_name }},</p>

        <p>Your meeting has been successfully scheduled.</p>

        <hr>

        <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($booking->date)->format('F j, Y') }}</p>
        <p><strong>Time:</strong> {{ \Carbon\Carbon::parse($booking->start_time)->format('g:i A') }}</p>

        <hr>

        <p>If you need to reschedule or cancel, please contact the host.</p>

        <p style="margin-top:30px;">
            Thanks,<br>
            <strong>MiniCalendly Team</strong>
        </p>
    </div>
</body>
</html>
