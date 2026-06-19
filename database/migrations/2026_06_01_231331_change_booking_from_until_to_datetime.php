<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Change the booking date fields from dates to date-time values.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dateTime('from')->change();
            $table->dateTime('until')->change();
        });
    }

    /**
     * Change the booking date-time fields back to dates.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->date('from')->change();
            $table->date('until')->change();
        });
    }
};
