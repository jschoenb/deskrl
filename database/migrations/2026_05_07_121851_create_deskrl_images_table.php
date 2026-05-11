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
        Schema::create('deskrl_images', function (Blueprint $table) {
            $table->id();

            // Links this image to one Deskrl.
            // If the Deskrl is deleted, its images should be deleted as well.
            $table->foreignId('deskrl_id')
                ->constrained('deskrls')
                ->cascadeOnDelete();

            // Stores the relative or absolute image path.
            $table->string('path');

            // Marks the main image used as the cover image.
            $table->boolean('is_main')->default(false);

            // Defines the display order of the images.
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskrl_images');
    }
};
