<?php

namespace App\Http\Controllers;

use App\Models\Enlistment;
use App\Models\Hero;
use App\Models\Quest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuestController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('quests/index', [
            'quests' => Quest::withCount('enlistments')->orderBy('starts_at')->get(),
        ]);
    }

    public function show(Quest $quest): Response
    {
        return Inertia::render('quests/show', [
            'quest' => $quest->load(['enlistments' => fn ($query) => $query->with('hero')->orderByDesc('mustered_at')]),
        ]);
    }

    public function muster(Request $request, Quest $quest): RedirectResponse
    {
        $data = $request->validate(['hero_code' => ['required', 'string', 'exists:heroes,hero_code']]);
        $hero = Hero::where('hero_code', $data['hero_code'])->firstOrFail();
        $enlistment = Enlistment::firstOrCreate(
            ['quest_id' => $quest->id, 'hero_id' => $hero->id],
            ['status' => 'registered'],
        );

        $isPresent = $enlistment->status === 'present';
        $enlistment->update([
            'status' => $isPresent ? 'departed' : 'present',
            'mustered_at' => now(),
        ]);
        $hero->update(['last_seen_at' => now()]);

        return back()->with('success', $hero->name.($isPresent ? ' departed the field.' : ' joined the party.'));
    }
}
