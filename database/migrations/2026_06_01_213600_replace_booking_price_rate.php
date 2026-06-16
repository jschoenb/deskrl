<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Change the booking price rate from a decimal value to a fixed enum value.
     */
    public function up(): void
    {
        if (Schema::hasColumn('bookings', 'price_rate')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropColumn('price_rate');
            });
        }

        if (!Schema::hasColumn('bookings', 'price_rate')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->enum('price_rate', [
                    'hour',
                    'half_day',
                    'day',
                    'week',
                    'month',
                ])->after('booking_date');
            });
        }
    }

    /**
     * Change the booking price rate back from enum to decimal.
     */
    public function down(): void
    {
        if (Schema::hasColumn('bookings', 'price_rate')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropColumn('price_rate');
            });
        }

        Schema::table('bookings', function (Blueprint $table) {
            $table
                ->decimal('price_rate', 10, 2)
                ->default(0)
                ->after('booking_date');
        });
    }
};
