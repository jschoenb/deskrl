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
        Schema::create('listing_categories', function (Blueprint $table) {
            $table->id();

            // Name der Kategorie, z. B. Arbeitsplatz, Büroraum, Seminarraum
            $table->string('name');

            // Gibt an, ob die Kategorie aktuell auswählbar ist
            $table->boolean('activated')->default(true);

            // Bestimmt, welche Eingabemaske beim Erstellen eines Deskrls angezeigt wird
            $table->enum('mask_type', ['mask_1', 'mask_2']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_categories');
    }
};
