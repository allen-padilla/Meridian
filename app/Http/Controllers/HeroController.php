<?php

namespace App\Http\Controllers;

use App\Models\Hero;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HeroController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim($request->string('search')->toString());

        $heroes = Hero::query()
            ->when($search, fn ($query) => $query->where(fn ($query) => $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('hero_code', 'like', "%{$search}%")
                ->orWhere('class', 'like', "%{$search}%")))
            ->orderBy('name')
            ->get();

        return Inertia::render('heroes/index', compact('heroes', 'search'));
    }

    public function show(Hero $hero): Response
    {
        return Inertia::render('heroes/show', [
            'hero' => $hero->load(['revisions' => fn ($query) => $query->latest(), 'enlistments.quest']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $hero = Hero::create($request->validate([
            'hero_code' => ['required', 'string', 'max:24', 'unique:heroes'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email'],
            'ancestry' => ['required', 'string', 'max:80'],
            'class' => ['required', 'string', 'max:80'],
            'level' => ['required', 'integer', 'between:1,20'],
            'faction' => ['nullable', 'string', 'max:80'],
        ]));

        return to_route('heroes.show', $hero)->with('success', 'Hero entered into the ledger.');
    }
}
