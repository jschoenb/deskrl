<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the Deskrl categories table with category names, activation status and mask types.
     */
    public function up(): void
    {
        Schema::create('deskrl_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('activated')->default(true);
            $table->enum('mask_type', ['mask_1', 'mask_2']);
            $table->timestamps();
        });
    }

    /**
     * Drop the Deskrl categories table.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskrl_categories');
    }
};
