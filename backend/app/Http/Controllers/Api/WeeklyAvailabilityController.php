<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\Booking;
use App\Models\WeeklyAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WeeklyAvailabilityController extends Controller
{
    /**
     * Get authenticated user's weekly availability
     */
    public function index(Request $request)
    {
        $availabilities = WeeklyAvailability::where('user_id', $request->user()->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json($availabilities);
    }

    /**
     * Store new weekly availability
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time'  => 'required|date_format:H:i:s',
            'end_time'    => 'required|date_format:H:i:s|after:start_time',
        ]);

        $availability = WeeklyAvailability::create([
            'user_id' => $request->user()->id,
            'day_of_week' => $data['day_of_week'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
        ]);

        return response()->json($availability, 201);
    }

    /**
     * Update existing availability
     */
    public function update(Request $request, $id)
    {
        $availability = WeeklyAvailability::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $data = $request->validate([
            'start_time' => 'sometimes|date_format:H:i:s',
            'end_time'   => 'sometimes|date_format:H:i:s|after:start_time',
        ]);

        $availability->update($data);

        return response()->json($availability);
    }

    /**
     * Delete availability
     */
    public function destroy(Request $request, $id)
    {
        $availability = WeeklyAvailability::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $availability->delete();

        return response()->json(['message' => 'Availability deleted']);
    }
}