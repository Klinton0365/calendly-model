<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\Booking;
use App\Models\WeeklyAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

// Step 1: AvailabilityController - Generate Daily Slots
class AvailabilityController extends Controller
{
    /**
     * Get available time slots for a specific date
     * PUBLIC endpoint - anyone can view availability
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'user_id' => 'required|exists:users,id', // The host
        ]);

        $date = $validated['date'];
        $userId = $validated['user_id'];
        
        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        // Use createFromFormat to parse ONLY the date string
        $dateObject = \Carbon\Carbon::createFromFormat('Y-m-d', $date);
        $dayOfWeek = $dateObject->dayOfWeek;
        
        // Get weekly availability for this day
        $weeklyAvailability = \App\Models\WeeklyAvailability::where('user_id', $userId)
            ->where('day_of_week', $dayOfWeek)
            ->first();
        
        if (!$weeklyAvailability) {
            return response()->json([
                'date' => $date,
                'slots' => []
            ]);
        }
        
        // Generate 30-minute time slots
        // Convert to string format if they're Carbon instances
        $startTime = $weeklyAvailability->start_time instanceof \Carbon\Carbon 
            ? $weeklyAvailability->start_time->format('H:i:s')
            : $weeklyAvailability->start_time;
            
        $endTime = $weeklyAvailability->end_time instanceof \Carbon\Carbon
            ? $weeklyAvailability->end_time->format('H:i:s')
            : $weeklyAvailability->end_time;
        
        $slots = $this->generateTimeSlots($startTime, $endTime, 30);
        
        // Get existing bookings for this date
        $bookedTimes = \App\Models\Booking::where('user_id', $userId)
            ->where('date', $date)
            ->pluck('start_time')
            ->map(function($time) {
                // Ensure consistent format (remove seconds if present)
                return substr($time, 0, 8); // HH:mm:ss
            })
            ->toArray();
        
        // Mark slots as booked or available
        $availableSlots = array_map(function($slot) use ($bookedTimes) {
            return [
                'start_time' => $slot,
                'status' => in_array($slot, $bookedTimes) ? 'booked' : 'available'
            ];
        }, $slots);
        
        return response()->json([
            'date' => $date,
            'slots' => $availableSlots
        ]);
    }
    
    /**
     * Generate time slots between start and end time
     */
    private function generateTimeSlots($startTime, $endTime, $intervalMinutes)
    {
        $slots = [];
        
        // Parse ONLY the time portion
        // If it's already a string in HH:mm:ss format, use it directly
        // Otherwise extract the time part
        if (strlen($startTime) > 8) {
            // Has date prefix, extract time only
            $startTime = substr($startTime, -8); // Last 8 chars: HH:mm:ss
        }
        if (strlen($endTime) > 8) {
            $endTime = substr($endTime, -8);
        }
        
        // Create Carbon instances from time strings
        $current = \Carbon\Carbon::createFromFormat('H:i:s', $startTime);
        $end = \Carbon\Carbon::createFromFormat('H:i:s', $endTime);
        
        while ($current->lt($end)) {
            $slots[] = $current->format('H:i:s');
            $current->addMinutes($intervalMinutes);
        }
        
        return $slots;
    }
}

// class AvailabilityController extends Controller
// {
//     public function index(Request $request)
//     {
//         Log::info('Availll: ', $request->all());
//         $request->validate([
//             'date' => 'required|date_format:Y-m-d',
//             // you could also later support ?user_id=
//         ]);

//         $date = $request->date;
//         $userId = 1; // single host scenario for this challenge

//         $availability = WeeklyAvailability::where('user_id', $userId)
//             ->where('date', $date)
//             ->first();

//         if (!$availability) {
//             return response()->json([
//                 'slots' => []
//             ]);
//         }

//         // generate slots
//         $slots = [];
//         $start = Carbon::parse($availability->date.' '.$availability->start_time);
//         $end = Carbon::parse($availability->date.' '.$availability->end_time);
//         $duration = $availability->slot_duration_minutes;

//         while ($start->lt($end)) {
//             $slotEnd = (clone $start)->addMinutes($duration);
//             if ($slotEnd->gt($end)) {
//                 break;
//             }

//             $slots[] = [
//                 'start_time' => $start->format('H:i'),
//                 'end_time' => $slotEnd->format('H:i'),
//             ];

//             $start->addMinutes($duration);
//         }

//         // get booked slots
//         $bookings = Booking::where('user_id', $userId)
//             ->where('date', $date)
//             ->get()
//             ->pluck('start_time')
//             ->map(fn ($t) => Carbon::parse($t)->format('H:i'))
//             ->toArray();

//         // mark slots as booked/open
//         $responseSlots = array_map(function ($slot) use ($bookings) {
//             $isBooked = in_array($slot['start_time'], $bookings);

//             return [
//                 'start_time' => $slot['start_time'],
//                 'end_time'   => $slot['end_time'],
//                 'status'     => $isBooked ? 'booked' : 'open',
//             ];
//         }, $slots);

//         return response()->json([
//             'date' => $date,
//             'slots' => $responseSlots,
//         ]);
//     }

//     // simple admin endpoints if you have time
//     public function store(Request $request)
//     {
//         $data = $request->validate([
//             'date' => 'required|date_format:Y-m-d',
//             'start_time' => 'required|date_format:H:i',
//             'end_time' => 'required|date_format:H:i|after:start_time',
//             'slot_duration_minutes' => 'required|integer|min:5',
//         ]);

//         $data['user_id'] = 1;

//         $availability = Availability::updateOrCreate(
//             ['user_id' => 1, 'date' => $data['date']],
//             $data
//         );

//         return response()->json($availability, 201);
//     }
// }
