<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weekly_availabilities', function (Blueprint $table) {
            $table->id();

            // Foreign key to users table
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            $table->integer('day_of_week');

            $table->time('start_time');
            $table->time('end_time');

            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('weekly_availabilities');
    }
};
