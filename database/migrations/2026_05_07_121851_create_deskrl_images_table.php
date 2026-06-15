<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the Deskrl images table with image paths, cover image flags and sort order.
     */
    public function up(): void
    {
        Schema::create('deskrl_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('deskrl_id')
                ->constrained('deskrls')
                ->cascadeOnDelete();

            $table->string('path');
            $table->boolean('is_main')->default(false);
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Drop the Deskrl images table.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskrl_images');
    }
};
