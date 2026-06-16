<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the favorites table to link user accounts with saved Deskrls.
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('accounts')->onDelete('cascade');
            $table->foreignId('deskrl_id')->constrained('deskrls')->onDelete('cascade');
            $table->unique(['user_id', 'deskrl_id']);
            $table->timestamps();
        });
    }

    /**
     * Drop the favorites table.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
