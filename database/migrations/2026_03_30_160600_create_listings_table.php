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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();

            $table->enum('type', [
                'workspace',
                'office',
                'coworking',
                'seminar',
                'event'
            ]);

            $table->enum('status', [
                'draft',
                'active',
                'inactive',
                'archived',
                'blocked'
            ])->default('draft');

            $table->integer('capacity')->nullable();
            $table->integer('price_hourly')->nullable();
            $table->integer('price_half_day')->nullable();
            $table->integer('price_per_day')->nullable();
            $table->integer('price_per_week')->nullable();
            $table->integer('price_per_month')->nullable();

            $table->foreignId('host_id')->constrained();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
