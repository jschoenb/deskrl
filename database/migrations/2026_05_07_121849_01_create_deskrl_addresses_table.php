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
        Schema::create('deskrl_addresses', function (Blueprint $table) {
            $table->id();

            // Each Deskrl can have only one address link.
            $table->foreignId('deskrl_id')
                ->unique()
                ->constrained('deskrls')
                ->cascadeOnDelete();

            // The same address can be reused by multiple Deskrls.
            $table->foreignId('address_id')
                ->constrained('addresses')
                ->restrictOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskrl_addresses');
    }
};
