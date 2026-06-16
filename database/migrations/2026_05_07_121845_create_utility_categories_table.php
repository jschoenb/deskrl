<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the utility categories table with translated category names.
     */
    public function up(): void
    {
        Schema::create('utility_categories', function (Blueprint $table) {
            $table->id();
            $table->json('category_name');
            $table->timestamps();
        });
    }

    /**
     * Drop the utility categories table.
     */
    public function down(): void
    {
        Schema::dropIfExists('utility_categories');
    }
};
