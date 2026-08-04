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
        Schema::create('quests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('summary')->nullable();
            $table->string('location');
            $table->string('difficulty')->default('standard');
            $table->string('status')->default('upcoming');
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->unsignedSmallInteger('party_limit')->nullable();
            $table->json('requirements')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quests');
    }
};
