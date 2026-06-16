<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the special availabilities table with custom date-based time slots for Deskrls.
     */
    public function up(): void
    {
        Schema::create('special_availabilities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('deskrl_id')
                ->constrained('deskrls')
                ->onDelete('cascade');

            $table->date('exception_date');
            $table->time('start_time');
            $table->time('end_time');

            $table->timestamps();
        });
    }

    /**
     * Drop the special availabilities table.
     */
    public function down(): void
    {
        Schema::dropIfExists('special_availabilities');
    }
};
