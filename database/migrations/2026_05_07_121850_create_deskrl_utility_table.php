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
        Schema::create('deskrl_utility', function (Blueprint $table) {
            $table->id();

            // Links this utility entry to one Deskrl.
            // If the Deskrl is deleted, the utility link should be deleted as well.
            $table->foreignId('deskrl_id')
                ->constrained('deskrls')
                ->cascadeOnDelete();

            // Links this utility entry to one existing utility.
            // Utilities are system-defined and should not be deleted while still in use.
            $table->foreignId('utility_id')
                ->constrained('utilities')
                ->restrictOnDelete();

            // Optional amount for countable utilities, e.g. number of monitors or power outlets.
            $table->unsignedInteger('quantity')->nullable();

            $table->timestamps();

            // Prevents assigning the same utility twice to the same Deskrl.
            $table->unique(['deskrl_id', 'utility_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskrl_utility');
    }
};
