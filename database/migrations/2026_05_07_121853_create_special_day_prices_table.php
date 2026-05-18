<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('special_day_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deskrl_id')->constrained('deskrls')->onDelete('cascade');
            $table->date('date');                              // ← DIESE ZEILE HINZUFÜGEN
            $table->decimal('special_price_per_day', 10, 2);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('special_day_prices');
    }
};
