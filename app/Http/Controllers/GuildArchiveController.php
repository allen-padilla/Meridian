<?php

namespace App\Http\Controllers;

use App\Models\Enlistment;
use App\Models\Hero;
use App\Models\Quest;
use Inertia\Inertia;
use Inertia\Response;

class GuildArchiveController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('archive/index', [
            'counts' => [
                'heroes' => Hero::count(),
                'quests' => Quest::count(),
                'fieldRecords' => Enlistment::count(),
            ],
            'records' => Enlistment::with(['hero', 'quest'])->latest('updated_at')->limit(12)->get(),
        ]);
    }
}
