<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeeklyAvailability extends Model
{
    protected $fillable = [
        'user_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    // protected $casts = [
    //     'start_time' => 'datetime:H:i',
    //     'end_time' => 'datetime:H:i',
    // ];

    protected $casts = [
        'start_time' => 'string',
        'end_time' => 'string',
    ];

}
