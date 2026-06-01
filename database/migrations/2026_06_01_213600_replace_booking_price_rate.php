<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Change bookings.price_rate from decimal to enum.
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
                    'hourly',
                    'half_day',
                    'daily',
                    'weekly',
                    'monthly',
                ])->after('booking_date');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('bookings', 'price_rate')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropColumn('price_rate');
            });
        }

        Schema::table('bookings', function (Blueprint $table) {
            $table->decimal('price_rate', 10, 2)->after('booking_date');
        });
    }
};
