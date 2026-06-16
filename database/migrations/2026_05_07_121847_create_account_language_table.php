<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the account-language pivot table for account language assignments.
     */
    public function up(): void
    {
        Schema::create('account_language', function (Blueprint $table) {
            $table->foreignId('account_id')
                ->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('language_id')
                ->constrained('languages')->cascadeOnDelete();
            $table->primary(['account_id', 'language_id']);
            $table->timestamps();
        });
    }

    /**
     * Drop the account-language pivot table.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_language');
    }
};
