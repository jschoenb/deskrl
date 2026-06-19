<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the accounts table with login, profile, role and status fields.
     */
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('password');
            $table->boolean('email_verified')->default(false);
            $table->enum('account_type',
                ['user', 'private_host', 'commercial_host', 'admin'])
                ->default('user');
            $table->string('phone')->nullable();
            $table->string('profile_image')->nullable();
            $table->enum('status', ['active', 'deactivated', 'deleted'])->default('active');
            $table->date('birthdate')->nullable();
            $table->enum('gender', ['male', 'female', 'diverse', 'undefined'])
                ->default('undefined');
            $table->json('about_me')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Drop the accounts table.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
