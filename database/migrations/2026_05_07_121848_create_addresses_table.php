<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the addresses table with country, location and optional address detail fields.
     */
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')->constrained('countries');
            $table->string('state')->nullable();
            $table->string('city');
            $table->string('street');
            $table->string('house_nr');
            $table->string('postal_code');
            $table->string('stair')->nullable();
            $table->string('door')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Drop the addresses table.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
