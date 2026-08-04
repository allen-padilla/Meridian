<?php

namespace App\Http\Controllers;

use App\Models\HeroRevision;
use Inertia\Inertia;
use Inertia\Response;

class HeroRevisionController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('revisions/index', [
            'revisions' => HeroRevision::with('hero')->latest()->get(),
        ]);
    }
}
