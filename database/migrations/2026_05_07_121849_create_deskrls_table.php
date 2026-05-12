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
        Schema::create('deskrls', function (Blueprint $table) {
            $table->id();

            // A Deskrl belongs to one host account.
            $table->foreignId('host_account_id')
                ->constrained('accounts')
                ->cascadeOnDelete();

            // A Deskrl belongs to one Deskrl category.
            // Nullable because a Deskrl can be saved as draft before all steps are completed.
            $table->foreignId('deskrl_category_id')
                ->nullable()
                ->constrained('deskrl_categories')
                ->nullOnDelete();

            // Multilingual fields stored as JSON, e.g. {"de": "Meetingraum", "en": "Meeting room"}.
            $table->json('title')->nullable();
            $table->json('description')->nullable();

            // Status of the Deskrl listing.
            $table->enum('status', [
                'draft',
                'active',
                'inactive',
                'archived',
                'blocked',
            ])->default('draft');

            // General capacity of the Deskrl.
            $table->unsignedInteger('capacity')->nullable();

            // Price fields.
            $table->decimal('price_per_hour', 10, 2)->nullable();
            $table->decimal('price_per_half_day', 10, 2)->nullable();
            $table->decimal('price_per_day', 10, 2)->nullable();
            $table->decimal('price_per_week', 10, 2)->nullable();
            $table->decimal('price_per_month', 10, 2)->nullable();

            // Booking settings.
            $table->boolean('instant_bookable')->default(false);
            $table->unsignedInteger('min_hours')->nullable();
            $table->unsignedInteger('max_hours')->nullable();

            // How far in advance a booking must be made in hours.
            $table->unsignedInteger('bookable_before_hours')->nullable();

            // How far in advance the Deskrl can be booked in months.
            $table->unsignedInteger('bookable_until_months')->nullable();

            $table->timestamps();

            // Adds deleted_at for soft deletes.
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deskrls');
    }
};
