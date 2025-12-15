<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id', 'visitor_name', 'visitor_email', 'date', 'start_time', 'end_time'
    ];

    // protected $casts = [
    //     'date' => 'date',
    //     'start_time' => 'datetime:H:i',
    //     'end_time' => 'datetime:H:i',
    // ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'string',  // Keep as string
        'end_time' => 'string',    // Keep as string
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
