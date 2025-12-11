<?php

namespace App\Http\Controllers;

use App\Models\WeeklyAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAvailabilityController extends Controller
{
    /**
     * Return all weekly availability (Sun–Sat)
     */
    public function index()
    {
        $userId = 1; // single user system for challenge

        $weekly = WeeklyAvailability::where('user_id', $userId)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json($weekly);
    }

    /**
     * Save all availability intervals submitted from frontend
     */
    public function save(Request $request)
    {
        $userId = 1;

        $request->validate([
            'weekly' => 'required|array',
            'weekly.*.day_of_week' => 'required|integer|min:0|max:6',
            'weekly.*.start_time' => 'required',
            'weekly.*.end_time' => 'required|after:weekly.*.start_time',
        ]);

        DB::transaction(function () use ($request, $userId) {
            // (1) Delete all existing weekly records
            WeeklyAvailability::where('user_id', $userId)->delete();

            // (2) Insert new intervals
            foreach ($request->weekly as $row) {
                WeeklyAvailability::create([
                    'user_id' => $userId,
                    'day_of_week' => $row['day_of_week'],
                    'start_time' => $row['start_time'],
                    'end_time' => $row['end_time'],
                ]);
            }
        });

        return response()->json(['message' => 'Weekly availability saved successfully']);
    }

    /**
     * Delete a specific interval
     */
    public function delete($id)
    {
        $availability = WeeklyAvailability::find($id);

        if (!$availability) {
            return response()->json(['message' => 'Interval not found'], 404);
        }

        $availability->delete();

        return response()->json(['message' => 'Interval deleted']);
    }
}
