<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuildArchiveController;
use App\Http\Controllers\HeroAnalyticsController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\HeroRevisionController;
use App\Http\Controllers\QuestController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('heroes/analytics', HeroAnalyticsController::class)->name('heroes.analytics');
    Route::resource('heroes', HeroController::class)->only(['index', 'show', 'store']);
    Route::resource('quests', QuestController::class)->only(['index', 'show']);
    Route::post('quests/{quest}/muster', [QuestController::class, 'muster'])->name('quests.muster');
    Route::get('revisions', HeroRevisionController::class)->name('revisions.index');
    Route::get('archive', GuildArchiveController::class)->name('archive.index');
});

require __DIR__.'/settings.php';
