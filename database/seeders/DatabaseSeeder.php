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
    /**
     * A season of expeditions beyond the four featured quests, as
     * [name, summary, location, difficulty, days from today].
     * Negative offsets are completed expeditions, positive ones are upcoming.
     */
    private const CHRONICLE = [
        ['Siege of Frostmere', 'Break the ice-bound blockade before the river freezes solid.', 'Frostmere', 'legendary', -210],
        ['The Glass Citadel', 'Escort the glaziers to the citadel and guard the panes on the climb.', 'Astra Peaks', 'epic', -180],
        ['Ashes of Dawn', 'Search the burned chapel for the reliquary before looters do.', 'Dawnmere', 'standard', -160],
        ['The Hollow Road', 'Clear the sinkholes on the trade road and mark the safe line.', 'Copperwind Pass', 'standard', -140],
        ['Vault of Tides', 'Recover the tide ledgers from the flooded vault at low water.', 'Blackwater Reach', 'epic', -120],
        ['The Lantern March', 'Relight the beacon lamps along the coast road in a single night.', 'Blackwater Reach', 'standard', -100],
        ['Echoes Beneath Alderkeep', 'Map the tunnels under the keep and seal every breach you find.', 'Elderbloom', 'epic', -85],
        ['The Silver Crossing', 'Hold the ferry crossing until the treaty caravan is across.', 'Thornmere Marsh', 'standard', -70],
        ['Wardens of the Orchard', 'Find the missing apprentice somewhere in the orchard ruins.', 'Elderbloom', 'standard', -56],
        ['The Copper Toll', 'Escort the toll wardens and their strongbox through the pass.', 'Copperwind Pass', 'standard', -42],
        ['Nightfall at Highcairn', 'Stand the watch at Highcairn while the garrison changes over.', 'Frostmere', 'epic', -30],
        ['The Drowned Bell', 'Raise the sunken chapel bell before the spring floods bury it.', 'Thornmere Marsh', 'legendary', -21],
        ['Cinders of the Mill', 'Put out the mill fire and find what started it.', 'Dawnmere', 'standard', -14],
        ['The Long Portage', 'Carry the survey boats over the ridge to the upper lakes.', 'Astra Peaks', 'standard', -7],
        ['Council of Embers', 'Guard the faction council through three nights of talks.', 'Dawnmere', 'epic', -3],
        ['The Wayfarer\'s Ledger', 'Verify every wanderer\'s standing before the spring muster.', 'Elderbloom', 'standard', 2],
        ['Beacons of Blackwater', 'Reset the harbour beacons before the fishing fleet returns.', 'Blackwater Reach', 'standard', 5],
        ['The Stonewright\'s Debt', 'Recover the stolen mason marks from the quarry camp.', 'Copperwind Pass', 'standard', 8],
        ['Frost on the Alder', 'Deliver cold-weather stores to the alder camps before the freeze.', 'Frostmere', 'epic', 12],
        ['The Quiet Ford', 'Scout the ford for the caravan and report the water level.', 'Thornmere Marsh', 'standard', 14],
        ['Vigil of the Verdant Gate', 'Keep the gate vigil through the equinox night.', 'Elderbloom', 'legendary', 19],
        ['Salt and Cinder', 'Escort the salt wagons past the cinder fields.', 'Dawnmere', 'standard', 23],
        ['The Starfall Survey', 'Chart the crater field before the next storm buries it.', 'Astra Peaks', 'epic', 31],
        ['Hearth of the Iron Covenant', 'Muster the covenant smiths for the forge reopening.', 'Copperwind Pass', 'standard', 38],
        ['The Moth Lantern', 'Track the lantern lights seen over the marsh and name their source.', 'Thornmere Marsh', 'standard', 45],
        ['Crown of the High Pass', 'Lead the crown procession over the pass and back.', 'Astra Peaks', 'legendary', 60],
    ];

    private const REQUIREMENTS = [
        'Bring a guild crest',
        'Prepare two days of provisions',
        'Cold-weather gear required',
        'Carry a healing draught',
        'Report to muster thirty minutes early',
    ];

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
        $chronicleQuests = collect(self::CHRONICLE)->map(function (array $data, int $index) {
            [$name, $summary, $location, $difficulty, $offset] = $data;
            $startsAt = CarbonImmutable::today()
                ->addDays($offset)
                ->setTime(8 + ($index % 6), $index % 2 === 0 ? 0 : 30);

            return Quest::updateOrCreate(['name' => $name], [
                'summary' => $summary,
                'location' => $location,
                'difficulty' => $difficulty,
                'status' => $offset < 0 ? 'completed' : 'upcoming',
                'starts_at' => $startsAt,
                'ends_at' => $startsAt->addHours(4 + ($index % 5) * 2),
                'party_limit' => 6 + ($index % 5) * 2,
                'requirements' => array_slice(self::REQUIREMENTS, $index % 3, 2),
            ]);
        });
        $allHeroes = $heroes->concat($generatedHeroes);
        $allQuests = $quests->concat($chronicleQuests);

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
