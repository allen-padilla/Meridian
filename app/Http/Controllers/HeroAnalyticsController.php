<?php

namespace App\Http\Controllers;

use App\Models\Enlistment;
use App\Models\Hero;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class HeroAnalyticsController extends Controller
{
    public function __invoke(): Response
    {
        $totalHeroes = Hero::count();
        $verifiedHeroes = Hero::where('verification_status', 'verified')->count();
        $activeHeroes = Hero::where('last_seen_at', '>=', now()->subDays(90))->count();
        $participatingHeroes = Enlistment::distinct('hero_id')->count('hero_id');

        return Inertia::render('heroes/analytics', [
            'overview' => [
                'totalHeroes' => $totalHeroes,
                'verifiedRate' => $this->percentage($verifiedHeroes, $totalHeroes),
                'activeRate' => $this->percentage($activeHeroes, $totalHeroes),
                'participationRate' => $this->percentage($participatingHeroes, $totalHeroes),
                'averageLevel' => round((float) Hero::avg('level'), 1),
            ],
            'growth' => $this->growthSeries(),
            'factions' => $this->distribution('faction'),
            'classes' => $this->distribution('class', 6),
            'verification' => $this->distribution('verification_status'),
            'levelBands' => $this->levelBands(),
            'questActivity' => [
                'totalEnlistments' => Enlistment::count(),
                'musteredEnlistments' => Enlistment::whereNotNull('mustered_at')->count(),
                'averageQuestsPerHero' => $totalHeroes > 0
                    ? round(Enlistment::count() / $totalHeroes, 1)
                    : 0,
            ],
        ]);
    }

    /** @return Collection<int, array{label: string, value: int}> */
    private function distribution(string $column, ?int $limit = null): Collection
    {
        $query = Hero::query()
            ->selectRaw("{$column} as label, count(*) as value")
            ->whereNotNull($column)
            ->groupBy($column)
            ->orderByDesc('value');

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get()->map(fn (Hero $row) => [
            'label' => (string) $row->getAttribute('label'),
            'value' => (int) $row->getAttribute('value'),
        ])->values();
    }

    /** @return Collection<int, array{label: string, value: int}> */
    private function growthSeries(): Collection
    {
        $firstMonth = CarbonImmutable::now()->startOfMonth()->subMonths(5);

        return collect(range(0, 5))->map(function (int $offset) use ($firstMonth) {
            $month = $firstMonth->addMonths($offset);

            return [
                'label' => $month->format('M'),
                'value' => Hero::whereBetween('created_at', [
                    $month->startOfMonth(),
                    $month->endOfMonth(),
                ])->count(),
            ];
        });
    }

    /** @return Collection<int, array{label: string, value: int}> */
    private function levelBands(): Collection
    {
        return collect([
            ['label' => 'Levels 1-5', 'min' => 1, 'max' => 5],
            ['label' => 'Levels 6-10', 'min' => 6, 'max' => 10],
            ['label' => 'Levels 11-15', 'min' => 11, 'max' => 15],
            ['label' => 'Levels 16-20', 'min' => 16, 'max' => 20],
        ])->map(fn (array $band) => [
            'label' => $band['label'],
            'value' => Hero::whereBetween('level', [$band['min'], $band['max']])->count(),
        ]);
    }

    private function percentage(int $value, int $total): float
    {
        return $total > 0 ? round(($value / $total) * 100, 1) : 0;
    }
}
