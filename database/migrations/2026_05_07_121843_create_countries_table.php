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
        Schema::create('countries', function (Blueprint $table) {
            $table->id();

            // Name als JSON für spätere Übersetzungen, z. B. {"de": "Österreich", "en": "Austria"}
            $table->json('name');

            // Symbol oder Länderzeichen, falls ihr eines speichern wollt
            $table->string('symbol')->nullable();

            // Ländercode, z. B. AT, DE
            $table->string('code', 2)->unique();

            // Währung, z. B. Euro
            $table->string('currency');

            // Währungssymbol, z. B. €
            $table->string('currency_symbol', 5);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
