<?php

namespace App\Http\Controllers;

use App\Models\Hero;
use App\Models\HeroRevision;
use App\Models\Quest;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'metrics' => [
                'heroes' => Hero::count(),
                'verified' => Hero::where('verification_status', 'verified')->count(),
                'pendingRevisions' => HeroRevision::where('status', 'pending')->count(),
                'activeQuests' => Quest::whereIn('status', ['upcoming', 'active'])->count(),
            ],
            'nextQuest' => Quest::withCount('enlistments')->where('starts_at', '>=', now())->orderBy('starts_at')->first(),
            'recentHeroes' => Hero::latest()->limit(5)->get(),
            'factions' => Hero::selectRaw('faction, count(*) as total')->whereNotNull('faction')->groupBy('faction')->orderByDesc('total')->get(),
        ]);
    }
}
