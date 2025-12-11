<?php

use App\Http\Controllers\Api\AdminAvailabilityController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\BookingController;

// Example API test route
Route::get('/ping', function () {
    return response()->json(['message' => 'API working']);
});


// Route::get('/availability', [AvailabilityController::class, 'index']); // ?date=YYYY-MM-DD
// Route::post('/bookings', [BookingController::class, 'store']);

// (optional admin)
Route::get('/admin/availability', [AvailabilityController::class, 'listForAdmin']);
Route::post('/admin/availability', [AvailabilityController::class, 'store']);

Route::get("/admin/weekly", [AdminAvailabilityController::class, "index"]);
Route::post("/admin/weekly/save", [AdminAvailabilityController::class, "save"]);
Route::delete("/admin/weekly/{id}", [AdminAvailabilityController::class, "delete"]);

Route::get('/availability', [AvailabilityController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);

