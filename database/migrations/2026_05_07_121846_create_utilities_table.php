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
        Schema::create('utilities', function (Blueprint $table) {
            $table->id();

            // Verknüpfung zur Kategorie, z. B. Technik, Komfort, Mobilität
            $table->foreignId('utility_category_id')
                ->constrained('utility_categories')
                ->cascadeOnDelete();

            // Name als JSON für spätere Übersetzungen,
            // z. B. {"de": "WLAN", "en": "WiFi"}
            $table->json('name');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilities');
    }
};
