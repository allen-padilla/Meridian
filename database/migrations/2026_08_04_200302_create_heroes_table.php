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
        Schema::create('heroes', function (Blueprint $table) {
            $table->id();
            $table->string('hero_code')->unique();
            $table->string('name');
            $table->string('epithet')->nullable();
            $table->string('email')->nullable();
            $table->string('ancestry');
            $table->string('class');
            $table->unsignedTinyInteger('level')->default(1);
            $table->string('home_realm')->nullable();
            $table->string('faction')->nullable();
            $table->string('verification_status')->default('unverified');
            $table->string('standing_status')->default('pending');
            $table->boolean('guild_crest_issued')->default(false);
            $table->dateTime('last_seen_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('heroes');
    }
};
