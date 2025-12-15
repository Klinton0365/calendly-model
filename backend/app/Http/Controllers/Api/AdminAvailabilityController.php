<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeeklyAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAvailabilityController extends Controller
{
    public function index(Request $request)
    {
        // Get authenticated user ID
        $userId = $request->user()->id;

        return WeeklyAvailability::where('user_id', $userId)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
    }

    public function save(Request $request)
{
    \Log::info("saveeeeeeeee", $request->all());
    
    $userId = $request->user()->id;
    $weekly = $request->weekly;

    // Get all existing intervals for this user
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
                'start_time' => $start,
                'end_time' => $end,
            ]);
        } 
        // UPDATE interval
        else {
            WeeklyAvailability::where('id', $item['id'])
                ->where('user_id', $userId)
                ->update([
                    'day_of_week' => $item['day_of_week'],
                    'start_time' => $start,
                    'end_time' => $end,
                ]);
        }
    }

    // Return the updated data
    $updated = WeeklyAvailability::where('user_id', $userId)
        ->orderBy('day_of_week')
        ->orderBy('start_time')
        ->get();

    return response()->json([
        'message' => 'saved',
        'data' => $updated  // ← Return the saved data
    ]);
}

    // public function save(Request $request)
    // {
    //     \Log::info('saveeeeeeeee',$request->all());
        
    //     // Get authenticated user ID
    //     $userId = $request->user()->id;

    //     $weekly = $request->weekly;

    //     // Get all existing intervals for this user
    //     $existing = WeeklyAvailability::where('user_id', $userId)->get();

    //     $receivedIds = collect($weekly)->pluck('id')->filter()->toArray();

    //     // DELETE intervals removed in UI
    //     WeeklyAvailability::where('user_id', $userId)
    //         ->whereNotIn('id', $receivedIds)
    //         ->delete();

    //     foreach ($weekly as $item) {
    //         $start = date("H:i:s", strtotime($item['start_time']));
    //         $end = date("H:i:s", strtotime($item['end_time']));

    //         // CREATE new interval
    //         if (!$item['id']) {
    //             WeeklyAvailability::create([
    //                 'user_id' => $userId,
    //                 'day_of_week' => $item['day_of_week'],
    //                 'start_time' => $start,
    //                 'end_time' => $end,
    //             ]);
    //         } 
    //         // UPDATE interval (only if it belongs to this user)
    //         else {
    //             WeeklyAvailability::where('id', $item['id'])
    //                 ->where('user_id', $userId) // Security: ensure user owns this record
    //                 ->update([
    //                     'day_of_week' => $item['day_of_week'],
    //                     'start_time' => $start,
    //                     'end_time' => $end,
    //                 ]);
    //         }
    //     }

    //     return response()->json(['message' => 'saved']);
    // }

    public function delete(Request $request, $id)
    {
        // Get authenticated user ID
        $userId = $request->user()->id;

        // Only delete if the record belongs to this user
        WeeklyAvailability::where('id', $id)
            ->where('user_id', $userId)
            ->delete();

        return response()->json(['message' => 'Interval deleted']);
    }
}

// class AdminAvailabilityController extends Controller
// {
//     public function index()
//     {
//         $userId = 1;

//         return WeeklyAvailability::where('user_id', $userId)
//             ->orderBy('day_of_week')
//             ->orderBy('start_time')
//             ->get();
//     }

//     public function save(Request $request)
// {
//     \Log::info($request->all());
//     $userId = 1;

//     $weekly = $request->weekly;

//     // Get all existing intervals
//     $existing = WeeklyAvailability::where('user_id', $userId)->get();

//     $receivedIds = collect($weekly)->pluck('id')->filter()->toArray();

//     // DELETE intervals removed in UI
//     WeeklyAvailability::where('user_id', $userId)
//         ->whereNotIn('id', $receivedIds)
//         ->delete();

//     foreach ($weekly as $item) {

//         $start = date("H:i:s", strtotime($item['start_time']));
//         $end = date("H:i:s", strtotime($item['end_time']));


//         // CREATE new interval
//         if (!$item['id']) {
//             WeeklyAvailability::create([
//                 'user_id' => $userId,
//                 'day_of_week' => $item['day_of_week'],
//                 // 'start_time' => $item['start_time'],
//                 // 'end_time' => $item['end_time'],
//                 'start_time' => $start,
//                 'end_time' => $end,

//             ]);
//         } 
//         // UPDATE interval
//         else {
//             WeeklyAvailability::where('id', $item['id'])
//                 ->update([
//                     'day_of_week' => $item['day_of_week'],
//                     // 'start_time' => $item['start_time'],
//                     // 'end_time' => $item['end_time'],
//                     'start_time' => $start,
//                     'end_time' => $end,
//                 ]);
//         }
//     }

//     return response()->json(['message' => 'saved']);
// }


//     public function delete($id)
//     {
//         WeeklyAvailability::findOrFail($id)->delete();

//         return response()->json(['message' => 'Interval deleted']);
//     }
// }
