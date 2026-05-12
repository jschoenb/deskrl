<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('special_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained('deskrls')->onDelete('cascade');
            $table->date('exception_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('special_availabilities');
    }
};
