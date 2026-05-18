<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('accounts')->onDelete('cascade');
            $table->foreignId('deskrl_id')->constrained('deskrls')->onDelete('cascade');
            $table->date('from');
            $table->date('until');
            $table->date('booking_date');
            $table->decimal('price_rate', 10, 2);
            $table->decimal('price', 10, 2);
            $table->enum('status', ['pending','confirmed','cancelled'])->default('pending');
            $table->enum('payment_status', ['unpaid','paid','refunded'])->default('unpaid');
            $table->foreignId('billing_address_id')->nullable()->constrained('addresses')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
