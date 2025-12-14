<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeeklyAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAvailabilityController extends Controller
{
    public function index()
    {
        $userId = 1;

        return WeeklyAvailability::where('user_id', $userId)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
    }

    // public function save(Request $request)
    // {
    //     $userId = 1;

    //     $request->validate([
    //         'weekly' => 'required|array',
    //         'weekly.*.day_of_week' => 'required|integer|min:0|max:6',
    //         'weekly.*.start_time' => 'required',
    //         'weekly.*.end_time' => 'required|after:weekly.*.start_time',
    //     ]);

    //     DB::transaction(function () use ($request, $userId) {

    //         WeeklyAvailability::where('user_id', $userId)->delete();

    //         foreach ($request->weekly as $row) {
    //             WeeklyAvailability::create([
    //                 'user_id' => $userId,
    //                 'day_of_week' => $row['day_of_week'],
    //                 'start_time' => $row['start_time'],
    //                 'end_time' => $row['end_time'],
    //             ]);
    //         }
    //     });

    //     return response()->json(['message' => 'Weekly availability saved']);
    // }

    public function save(Request $request)
{
    \Log::info($request->all());
    $userId = 1;

    $weekly = $request->weekly;

    // Get all existing intervals
    $existing = WeeklyAvailability::where('user_id', $userId)->get();

    $receivedIds = collect($weekly)->pluck('id')->filter()->toArray();

    // DELETE intervals removed in UI
    WeeklyAvailability::where('user_id', $userId)
        ->whereNotIn('id', $receivedIds)
        ->delete();

    foreach ($weekly as $item) {

        $start = date("H:i:s", strtotime($item['start_time']));
        $end = date("H:i:s", strtotime($item['end_time']));


        // CREATE new interval
        if (!$item['id']) {
            WeeklyAvailability::create([
                'user_id' => $userId,
                'day_of_week' => $item['day_of_week'],
                // 'start_time' => $item['start_time'],
                // 'end_time' => $item['end_time'],
                'start_time' => $start,
                'end_time' => $end,

            ]);
        } 
        // UPDATE interval
        else {
            WeeklyAvailability::where('id', $item['id'])
                ->update([
                    'day_of_week' => $item['day_of_week'],
                    // 'start_time' => $item['start_time'],
                    // 'end_time' => $item['end_time'],
                    'start_time' => $start,
                    'end_time' => $end,
                ]);
        }
    }

    return response()->json(['message' => 'saved']);
}


    public function delete($id)
    {
        WeeklyAvailability::findOrFail($id)->delete();

        return response()->json(['message' => 'Interval deleted']);
    }
}
