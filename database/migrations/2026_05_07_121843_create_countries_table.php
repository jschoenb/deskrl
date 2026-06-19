<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the countries table with translated names, country codes and currency data.
     */
    public function up(): void
    {
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->string('symbol')->nullable();
            $table->string('code', 2)->unique();
            $table->string('currency');
            $table->string('currency_symbol', 5);
            $table->timestamps();
        });
    }

    /**
     * Drop the countries table.
     */
    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
