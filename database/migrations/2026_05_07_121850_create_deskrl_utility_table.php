<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the Deskrl utility pivot table with optional quantity values.
     */
    public function up(): void
    {
        Schema::create('deskrl_utility', function (Blueprint $table) {
            $table->id();

            $table->foreignId('deskrl_id')
                ->constrained('deskrls')
                ->cascadeOnDelete();

            $table->foreignId('utility_id')
                ->constrained('utilities')
                ->restrictOnDelete();

            $table->unsignedInteger('quantity')->nullable();

            $table->timestamps();

            $table->unique(['deskrl_id', 'utility_id']);
        });
    }

    /**
     * Drop the Deskrl utility pivot table.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskrl_utility');
    }
};
