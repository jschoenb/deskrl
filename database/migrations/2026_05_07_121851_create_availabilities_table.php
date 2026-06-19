<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the availabilities table with regular weekday time slots for Deskrls.
     */
    public function up(): void
    {
        Schema::create('availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deskrl_id')->constrained('deskrls')->onDelete('cascade');
            $table->enum('weekday', ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });
    }

    /**
     * Drop the availabilities table.
     */
    public function down(): void
    {
        Schema::dropIfExists('availabilities');
    }
};
