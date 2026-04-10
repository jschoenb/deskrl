<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('listing_id')->constrained('listings');

            $table->timestamp('start_time');
            $table->timestamp('end_time');

            $table->enum('price_rate', [
                'hourly',
                'half_day',
                'day',
                'week',
                'month',
            ]);

            $table->integer('price'); // in cents
            $table->enum('status', [
                'pending',
                'confirmed',
                'cancelled',
                'completed',
            ])->default('pending');

            $table->timestamp('booked_at')->useCurrent();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
