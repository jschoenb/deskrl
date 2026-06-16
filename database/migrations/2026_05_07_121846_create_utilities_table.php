<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the utilities table with translated names and category assignments.
     */
    public function up(): void
    {
        Schema::create('utilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utility_category_id')
                ->constrained('utility_categories')
                ->cascadeOnDelete();
            $table->json('name');
            $table->timestamps();
        });
    }

    /**
     * Drop the utilities table.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilities');
    }
};
