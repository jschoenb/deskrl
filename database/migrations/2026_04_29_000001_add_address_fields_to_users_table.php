<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fügt Adress- und Rechnungsadressfelder zur users-Tabelle hinzu.
     * Getrennte Migration damit bestehende Migrationen nicht angefasst werden müssen.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // ── Verifizierung ──────────────────────────────────────────────
            $table->enum('verification_status', ['unverified', 'pending', 'verified', 'rejected'])
                  ->default('unverified')
                  ->after('languages');

            // ── Wohnadresse ────────────────────────────────────────────────
            $table->string('country')->nullable()->after('verification_status');
            $table->string('street')->nullable()->after('country');
            $table->string('staircase')->nullable()->after('street');
            $table->string('apartment')->nullable()->after('staircase');
            $table->string('door')->nullable()->after('apartment');
            $table->string('postal_code')->nullable()->after('door');
            $table->string('city')->nullable()->after('postal_code');
            $table->string('state')->nullable()->after('city');

            // ── Rechnungsadresse ───────────────────────────────────────────
            $table->string('billing_company')->nullable()->after('state');
            $table->string('billing_vat_number')->nullable()->after('billing_company');
            $table->string('billing_country')->nullable()->after('billing_vat_number');
            $table->string('billing_street')->nullable()->after('billing_country');
            $table->string('billing_staircase')->nullable()->after('billing_street');
            $table->string('billing_apartment')->nullable()->after('billing_staircase');
            $table->string('billing_door')->nullable()->after('billing_apartment');
            $table->string('billing_postal_code')->nullable()->after('billing_door');
            $table->string('billing_city')->nullable()->after('billing_postal_code');
            $table->string('billing_state')->nullable()->after('billing_city');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'verification_status',
                'country', 'street', 'staircase', 'apartment', 'door',
                'postal_code', 'city', 'state',
                'billing_company', 'billing_vat_number',
                'billing_country', 'billing_street', 'billing_staircase',
                'billing_apartment', 'billing_door', 'billing_postal_code',
                'billing_city', 'billing_state',
            ]);
        });
    }
};
