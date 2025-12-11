<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        Log::info($request->all());
        $request->validate([
            'date' => 'required|date_format:Y-m-d',
            // you could also later support ?user_id=
        ]);

        $date = $request->date;
        $userId = 1; // single host scenario for this challenge

        $availability = Availability::where('user_id', $userId)
            ->where('date', $date)
            ->first();

        if (!$availability) {
            return response()->json([
                'slots' => []
            ]);
        }

        // generate slots
        $slots = [];
        $start = Carbon::parse($availability->date.' '.$availability->start_time);
        $end = Carbon::parse($availability->date.' '.$availability->end_time);
        $duration = $availability->slot_duration_minutes;

        while ($start->lt($end)) {
            $slotEnd = (clone $start)->addMinutes($duration);
            if ($slotEnd->gt($end)) {
                break;
            }

            $slots[] = [
                'start_time' => $start->format('H:i'),
                'end_time' => $slotEnd->format('H:i'),
            ];

            $start->addMinutes($duration);
        }

        // get booked slots
        $bookings = Booking::where('user_id', $userId)
            ->where('date', $date)
            ->get()
            ->pluck('start_time')
            ->map(fn ($t) => Carbon::parse($t)->format('H:i'))
            ->toArray();

        // mark slots as booked/open
        $responseSlots = array_map(function ($slot) use ($bookings) {
            $isBooked = in_array($slot['start_time'], $bookings);

            return [
                'start_time' => $slot['start_time'],
                'end_time'   => $slot['end_time'],
                'status'     => $isBooked ? 'booked' : 'open',
            ];
        }, $slots);

        return response()->json([
            'date' => $date,
            'slots' => $responseSlots,
        ]);
    }

    // simple admin endpoints if you have time
    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'slot_duration_minutes' => 'required|integer|min:5',
        ]);

        $data['user_id'] = 1;

        $availability = Availability::updateOrCreate(
            ['user_id' => 1, 'date' => $data['date']],
            $data
        );

        return response()->json($availability, 201);
    }
}
