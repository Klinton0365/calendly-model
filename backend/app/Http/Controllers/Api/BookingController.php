<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Availability;
use App\Models\WeeklyAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmationMail;
use Illuminate\Database\QueryException;

class BookingController extends Controller
{
    /**
     * Get all bookings for authenticated user (HOST)
     * This shows all the bookings made on YOUR calendar
     */
    public function index(Request $request)
{
    // ❌ This logs empty array for GET requests
    \Log::info('Fetching Meeting: ', $request->all());
    
    // ✅ Better logging
    \Log::info('Fetching bookings', [
        'user_id' => $request->user()->id,
        'user_name' => $request->user()->name,
        'user_email' => $request->user()->email,
    ]);
    
    $userId = $request->user()->id;

    $bookings = Booking::where('user_id', $userId)
        ->orderBy('date', 'desc')
        ->orderBy('start_time', 'desc')
        ->get();

    // Log what was found
    \Log::info('Bookings found', [
        'count' => $bookings->count(),
        'data' => $bookings->toArray()
    ]);

    return response()->json($bookings);
}

    /**
     * Store a new booking
     * PUBLIC endpoint - visitors can book without auth
     */
    public function store(Request $request)
    {
        \Log::info('BOOKINGGGG: ', $request->all());
        $data = $request->validate([
            'user_id'       => 'required|exists:users,id', // Host being booked
            'date'          => 'required|date_format:Y-m-d',
            'start_time'    => 'required|date_format:H:i:s',
            'end_time'      => 'required|date_format:H:i:s|after:start_time',
            'visitor_name'  => 'required|string|max:255',
            'visitor_email' => 'required|email|max:255',
        ]);

        $userId = $data['user_id'];
        $date = $data['date'];
        $startTime = $data['start_time'];

        // Verify this time falls within weekly availability
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;
        
        $availability = WeeklyAvailability::where('user_id', $userId)
            ->where('day_of_week', $dayOfWeek)
            ->where('start_time', '<=', $startTime)
            ->where('end_time', '>', $startTime)
            ->exists();

        if (!$availability) {
            return response()->json([
                'success' => false,
                'message' => 'This time is not available for booking.'
            ], 422);
        }

        try {
            // Use transaction with pessimistic locking to prevent race conditions
            $booking = DB::transaction(function () use ($data, $userId, $date, $startTime) {
                // Check if slot is already booked (with lock)
                $exists = Booking::where('user_id', $userId)
                    ->where('date', $date)
                    ->where('start_time', $startTime)
                    ->lockForUpdate()
                    ->exists();

                if ($exists) {
                    return null; // Slot taken
                }

                // Create the booking
                return Booking::create([
                    'user_id'       => $userId,
                    'visitor_name'  => $data['visitor_name'],
                    'visitor_email' => $data['visitor_email'],
                    'date'          => $date,
                    'start_time'    => $startTime,
                    'end_time'      => $data['end_time'],
                ]);
            });

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sorry, that slot was just booked by someone else. Please choose another time.'
                ], 409);
            }

            // Optional: Send confirmation emails here
            Mail::to($booking->visitor_email)->send(new BookingConfirmationMail($booking));

            return response()->json([
                'success' => true,
                'message' => 'Your booking has been confirmed! A confirmation email has been sent.',
                'booking' => $booking
            ], 201);

        } catch (QueryException $e) {
            // Unique constraint violation fallback
            return response()->json([
                'success' => false,
                'message' => 'This time slot is no longer available.'
            ], 409);
        }
    }

    /**
     * Cancel a booking
     * Can be called by either the host or using a unique token
     */
    public function destroy(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        
        // Optional: Add authorization check
        // if ($request->user()->id !== $booking->user_id) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }
        
        $booking->delete();

        return response()->json([
            'message' => 'Booking cancelled successfully.'
        ]);
    }
}
