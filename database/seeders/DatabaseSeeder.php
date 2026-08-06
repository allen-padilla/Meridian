<?php

namespace Database\Seeders;

use App\Models\Enlistment;
use App\Models\Hero;
use App\Models\HeroRevision;
use App\Models\Quest;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate([
            'email' => 'guildmaster@meridian.test',
        ], [
            'name' => 'Elara Voss',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        $heroes = collect([
            ['M-0142', 'Kael Thornward', 'The Emberbound', 'Human', 'Spellblade', 12, 'Emberwatch', 'Crimson Accord', 'verified'],
            ['M-0287', 'Lyra Moonfall', 'Star of the North', 'High Elf', 'Ranger', 9, 'Silvershade', 'Verdant Circle', 'verified'],
            ['M-0319', 'Bram Ironroot', 'Keeper of Gates', 'Mountain Dwarf', 'Guardian', 15, 'Stoneharbor', 'Iron Covenant', 'verified'],
            ['M-0441', 'Seraphine Vale', 'The Quiet Flame', 'Aasimar', 'Cleric', 8, 'Dawnmere', 'Crimson Accord', 'pending_review'],
            ['M-0526', 'Torren Ash', 'Wayfinder', 'Half-Orc', 'Pathfinder', 6, 'Westreach', 'Verdant Circle', 'verified'],
            ['M-0613', 'Nim Wren', 'Whisper in Brass', 'Gnome', 'Artificer', 7, 'Cogspire', 'Iron Covenant', 'unverified'],
            ['M-0708', 'Ari Fen', null, 'Wood Elf', 'Druid', 4, 'Mossvale', 'Verdant Circle', 'pending_review'],
            ['M-0814', 'Cassian Rook', 'The Unbroken', 'Human', 'Vanguard', 11, 'Blackwater', 'Crimson Accord', 'verified'],
        ])->map(fn (array $data) => Hero::updateOrCreate(['hero_code' => $data[0]], [
            'name' => $data[1], 'epithet' => $data[2],
            'email' => str($data[1])->lower()->replace(' ', '.').'@realms.test',
            'ancestry' => $data[3], 'class' => $data[4], 'level' => $data[5],
            'home_realm' => $data[6], 'faction' => $data[7],
            'verification_status' => $data[8], 'standing_status' => $data[8] === 'verified' ? 'confirmed' : 'pending',
            'guild_crest_issued' => $data[8] === 'verified',
        ]));

        HeroRevision::updateOrCreate([
            'hero_id' => $heroes[3]->id,
            'source' => 'player_portal',
        ], [
            'changed_fields' => [
                'class' => ['active' => 'Acolyte', 'submitted' => 'Cleric'],
                'level' => ['active' => 7, 'submitted' => 8],
            ],
        ]);
        HeroRevision::updateOrCreate([
            'hero_id' => $heroes[6]->id,
            'source' => 'ledger_import',
        ], [
            'changed_fields' => ['home_realm' => ['active' => 'Unknown', 'submitted' => 'Mossvale']],
        ]);

        $quests = collect([
            ['The Shattered Observatory', 'Recover the fallen star charts before the next moonrise.', 'Astra Peaks', 'epic', now()->addDays(3), 6],
            ['Whispers Beneath Thornmere', 'Investigate the lanterns seen beneath the drowned ruins.', 'Thornmere Marsh', 'standard', now()->addDays(9), 8],
            ['The Brass Caravan', 'Escort the artificers and their volatile cargo through the pass.', 'Copperwind Pass', 'standard', now()->addDays(16), 10],
            ['Trial of the Verdant Crown', 'A faction trial of patience, lore, and wilderness craft.', 'Elderbloom', 'legendary', now()->addDays(27), 5],
        ])->map(fn (array $data) => Quest::updateOrCreate(['name' => $data[0]], [
            'summary' => $data[1], 'location' => $data[2],
            'difficulty' => $data[3], 'starts_at' => $data[4], 'party_limit' => $data[5],
            'requirements' => ['Bring a guild crest', 'Prepare two days of provisions'],
        ]));

        $generatedHeroes = collect(range(1000, 1091))->map(function (int $number) {
            $heroCode = sprintf('M-%04d', $number);
            $attributes = Hero::factory()->make()->getAttributes();
            unset($attributes['hero_code']);

            return Hero::firstOrCreate(['hero_code' => $heroCode], $attributes);
        });
        $generatedQuests = collect(range(1, 46))->map(function (int $number) {
            $name = sprintf('Guild Chronicle %02d', $number);
            $attributes = Quest::factory()->make()->getAttributes();
            unset($attributes['name']);

            return Quest::firstOrCreate(['name' => $name], $attributes);
        });
        $allHeroes = $heroes->concat($generatedHeroes);
        $allQuests = $quests->concat($generatedQuests);

        $heroes->take(5)->each(fn (Hero $hero, int $index) => Enlistment::firstOrCreate([
            'quest_id' => $quests[0]->id,
            'hero_id' => $hero->id,
        ], [
            'status' => $index < 2 ? 'present' : 'registered',
            'mustered_at' => $index < 2 ? now()->subMinutes(14 - $index * 4) : null,
        ]));
        $heroes->slice(2, 4)->each(fn (Hero $hero) => Enlistment::firstOrCreate([
            'quest_id' => $quests[1]->id, 'hero_id' => $hero->id,
        ], [
            'status' => 'registered',
        ]));

        $allQuests->slice(2)->each(function (Quest $quest) use ($allHeroes) {
            if ($quest->enlistments()->exists()) {
                return;
            }

            $partyLimit = max(3, (int) ($quest->party_limit ?? 8));
            $partySize = random_int(3, min($partyLimit, 10));

            $allHeroes->shuffle()->take($partySize)->each(function (Hero $hero) use ($quest) {
                $completed = $quest->status === 'completed';

                Enlistment::create([
                    'quest_id' => $quest->id,
                    'hero_id' => $hero->id,
                    'status' => $completed ? 'departed' : 'registered',
                    'mustered_at' => $completed
                        ? CarbonImmutable::parse((string) $quest->starts_at)->addMinutes(random_int(0, 45))
                        : null,
                ]);
            });
        });
    }
}
