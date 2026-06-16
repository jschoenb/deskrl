<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the Deskrl addresses table to link each Deskrl to one address.
     */
    public function up(): void
    {
        Schema::create('deskrl_addresses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('deskrl_id')
                ->unique()
                ->constrained('deskrls')
                ->cascadeOnDelete();

            $table->foreignId('address_id')
                ->constrained('addresses')
                ->restrictOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Drop the Deskrl addresses table.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskrl_addresses');
    }
};
