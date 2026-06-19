<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the account addresses table with account, address and billing address data.
     */
    public function up(): void
    {
        Schema::create('account_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')
                ->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('address_id')
                ->constrained('addresses')->cascadeOnDelete();
            $table->boolean('is_default')->default(false);
            $table->string('company_name')->nullable();
            $table->string('vat_nr')->nullable();
            $table->boolean('is_billing_address')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Drop the account addresses table.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_addresses');
    }
};
