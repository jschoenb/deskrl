<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add geographic coordinates to addresses for map display.
     */
    public function up(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            // Latitude and longitude are nullable because draft Deskrls may not have a complete location yet.
            $table->decimal('latitude', 10, 7)->nullable()->after('door');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });
    }

    /**
     * Reverse the migrations.
     * Remove geographic coordinates from addresses.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
