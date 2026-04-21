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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['user', 'host', 'admin'])->default('user');
            $table->enum('gender', ['male', 'female', 'diverse', 'undisclosed'])->default('undisclosed');

            $table->string('profile_image')->nullable();
            $table->string('job')->nullable();
            $table->string('company')->nullable();
            $table->text('about_me')->nullable();
            $table->date('birthday')->nullable();
            // $table->json('languages')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 'gender', 'profile_image', 'job', 'company', 'about_me', 'birthday',
            ]);
        });
    }
};
