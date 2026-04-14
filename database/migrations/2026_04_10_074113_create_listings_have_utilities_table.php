<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listing_utility', function (Blueprint $table) {
            $table->foreignId('listing_id')->constrained('listings')->onDelete('cascade');
            $table->foreignId('utility_id')->constrained('utilities')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['listing_id', 'utility_id']);
            $table->primary(['listing_id', 'utility_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_utility');
    }
};
