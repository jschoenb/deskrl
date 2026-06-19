<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the Deskrls table with host, category, content, status, pricing and booking settings.
     */
    public function up(): void
    {
        Schema::create('deskrls', function (Blueprint $table) {
            $table->id();

            $table->foreignId('host_account_id')
                ->constrained('accounts')
                ->cascadeOnDelete();

            $table->foreignId('deskrl_category_id')
                ->nullable()
                ->constrained('deskrl_categories')
                ->nullOnDelete();

            $table->json('title')->nullable();
            $table->json('description')->nullable();

            $table->enum('status', [
                'draft',
                'active',
                'inactive',
                'archived',
                'blocked',
            ])->default('draft');

            $table->unsignedInteger('capacity')->nullable();

            $table->decimal('price_per_hour', 10, 2)->nullable();
            $table->decimal('price_per_half_day', 10, 2)->nullable();
            $table->decimal('price_per_day', 10, 2)->nullable();
            $table->decimal('price_per_week', 10, 2)->nullable();
            $table->decimal('price_per_month', 10, 2)->nullable();

            $table->boolean('instant_bookable')->default(false);
            $table->unsignedInteger('min_hours')->nullable();
            $table->unsignedInteger('max_hours')->nullable();
            $table->unsignedInteger('bookable_before_hours')->nullable();
            $table->unsignedInteger('bookable_until_months')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Drop the Deskrls table.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskrls');
    }
};
