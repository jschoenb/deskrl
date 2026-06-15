<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the commercial accounts table with company data and verification status.
     */
    public function up(): void
    {
        Schema::create('commercial_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained('accounts')
                ->cascadeOnDelete();
            $table->string('company_name');
            $table->string('company_nr');
            $table->string('vat_nr');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Drop the commercial accounts table.
     */
    public function down(): void
    {
        Schema::dropIfExists('commercial_accounts');
    }
};
