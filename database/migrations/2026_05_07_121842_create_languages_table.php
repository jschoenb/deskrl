<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.iikjhkj
     */
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();

            // Name der Sprache, z. B. Deutsch, Englisch
            $table->string('name');

            // Optionaler Pfad zu einem Icon, z. B. Flagge
            $table->string('icon_path')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
