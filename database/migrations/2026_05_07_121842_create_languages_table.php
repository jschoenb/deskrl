<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the languages table with names and optional icon paths.
     */
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Drop the languages table.
     */
    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
