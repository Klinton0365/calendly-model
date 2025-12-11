<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Availability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'date'         => 'required|date_format:Y-m-d',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
            'visitor_name' => 'required|string|max:255',
            'visitor_email'=> 'required|email|max:255',
        ]);

        $userId = 1;

        // Optional: ensure chosen time falls into availability window
        $availability = Availability::where('user_id', $userId)
            ->where('date', $data['date'])
            ->first();

        if (!$availability) {
            return response()->json([
                'message' => 'No availability defined for this date.',
            ], 422);
        }

        // You can add more logic to check boundary if you want.

        try {
            $booking = DB::transaction(function () use ($data, $userId) {
                // Check if any existing booking at that exact start time
                $exists = Booking::where('user_id', $userId)
                    ->where('date', $data['date'])
                    ->where('start_time', $data['start_time'])
                    ->lockForUpdate()
                    ->exists();

                if ($exists) {
                    return null;
                }

                return Booking::create([
                    'user_id'       => $userId,
                    'visitor_name'  => $data['visitor_name'],
                    'visitor_email' => $data['visitor_email'],
                    'date'          => $data['date'],
                    'start_time'    => $data['start_time'],
                    'end_time'      => $data['end_time'],
                ]);
            });

            if (!$booking) {
                return response()->json([
                    'message' => 'Sorry, that slot was just booked. Please pick another one.',
                ], 409);
            }

            return response()->json([
                'message' => 'Booking confirmed!',
                'booking' => $booking,
            ], 201);

        } catch (QueryException $e) {
            // Unique constraint fallback
            return response()->json([
                'message' => 'Sorry, that slot is no longer available.',
            ], 409);
        }
    }
}
