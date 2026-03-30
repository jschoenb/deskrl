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
        Schema::create('hosts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();

            $table->string('first_name');
            $table->string('last_name');

            $table->boolean('is_company');
            $table->string('company_name')->nullable();
            $table->string('company_nr')->nullable();
            $table->string('vat_nr')->nullable(); //UID-Nummer

            $table->boolean('is_verified')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hosts');
    }
};
