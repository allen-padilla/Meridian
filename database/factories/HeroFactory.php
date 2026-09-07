<?php

namespace Database\Factories;

use App\Models\Hero;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Hero>
 */
class HeroFactory extends Factory
{
    private const GIVEN_NAMES = [
        'Aldric', 'Ansel', 'Briar', 'Brienne', 'Caspian', 'Corvin', 'Dagny', 'Delphine',
        'Eirlys', 'Emrys', 'Fenwick', 'Freya', 'Gaelen', 'Garrick', 'Halvard', 'Hollis',
        'Ilse', 'Isolde', 'Jasper', 'Jorah', 'Katriel', 'Kestrel', 'Leofric', 'Liadan',
        'Maelis', 'Marisol', 'Nerys', 'Nyle', 'Odalys', 'Orrin', 'Perrin', 'Quill',
        'Rowena', 'Soren', 'Tamsin', 'Ulric', 'Vesna', 'Wren', 'Ysolde', 'Zephyrine',
    ];

    private const FAMILY_NAMES = [
        'Ashgrove', 'Blackbriar', 'Brightwater', 'Coldwater', 'Copperfield', 'Dunmere',
        'Duskmantle', 'Elderglen', 'Emberlyn', 'Fairwind', 'Frostholm', 'Glenmoor',
        'Greymoor', 'Hawthorne', 'Ironwood', 'Larkspur', 'Moorcroft', 'Nightingale',
        'Oakhollow', 'Pellham', 'Quillon', 'Ravenscar', 'Stormvale', 'Thornbury',
        'Underhill', 'Valemont', 'Wintermere', 'Yarrow',
    ];

    private const REALMS = [
        'Emberwatch', 'Silvershade', 'Stoneharbor', 'Dawnmere', 'Westreach', 'Cogspire',
        'Mossvale', 'Blackwater', 'Frostholm', 'Highcairn', 'Larkhollow', 'Thornmere',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $createdAt = fake()->dateTimeBetween('-12 months', 'now');
        $verification = fake()->randomElement([
            'verified', 'verified', 'verified', 'pending_review', 'unverified',
        ]);
        $isVerified = $verification === 'verified';
        $name = fake()->unique()->randomElement(self::names());

        return [
            'hero_code' => 'M-'.fake()->unique()->numerify('####'),
            'name' => $name,
            'epithet' => fake()->optional(0.65)->randomElement([
                'The Dawnward', 'Keeper of Embers', 'Stormcaller', 'The Far-Seer',
                'Shield of Hollowmere', 'The Quiet Blade', 'Warden of Ash',
            ]),
            'email' => str($name)->lower()->replace(' ', '.').'@realms.test',
            'ancestry' => fake()->randomElement([
                'Human', 'High Elf', 'Wood Elf', 'Mountain Dwarf', 'Gnome',
                'Half-Orc', 'Aasimar', 'Halfling',
            ]),
            'class' => fake()->randomElement([
                'Ranger', 'Guardian', 'Spellblade', 'Cleric', 'Pathfinder',
                'Artificer', 'Druid', 'Vanguard',
            ]),
            'level' => fake()->numberBetween(1, 20),
            'home_realm' => fake()->randomElement(self::REALMS),
            'faction' => fake()->randomElement([
                'Crimson Accord', 'Verdant Circle', 'Iron Covenant', 'Azure Assembly',
            ]),
            'verification_status' => $verification,
            'standing_status' => $isVerified ? 'confirmed' : 'pending',
            'guild_crest_issued' => $isVerified,
            'last_seen_at' => fake()->optional(0.72)->dateTimeBetween('-6 months', 'now'),
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }

    /**
     * Every given and family name combination, so generated heroes read like the featured ones.
     *
     * @return list<string>
     */
    private static function names(): array
    {
        static $names;

        return $names ??= collect(self::GIVEN_NAMES)
            ->crossJoin(self::FAMILY_NAMES)
            ->map(fn (array $pair) => implode(' ', $pair))
            ->all();
    }
}
