<?php

namespace Database\Factories;

use App\Models\Hero;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Hero>
 */
class HeroFactory extends Factory
{
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

        return [
            'hero_code' => 'M-'.fake()->unique()->numerify('####'),
            'name' => fake()->name(),
            'epithet' => fake()->optional(0.65)->randomElement([
                'The Dawnward', 'Keeper of Embers', 'Stormcaller', 'The Far-Seer',
                'Shield of Hollowmere', 'The Quiet Blade', 'Warden of Ash',
            ]),
            'email' => fake()->safeEmail(),
            'ancestry' => fake()->randomElement([
                'Human', 'High Elf', 'Wood Elf', 'Mountain Dwarf', 'Gnome',
                'Half-Orc', 'Aasimar', 'Halfling',
            ]),
            'class' => fake()->randomElement([
                'Ranger', 'Guardian', 'Spellblade', 'Cleric', 'Pathfinder',
                'Artificer', 'Druid', 'Vanguard',
            ]),
            'level' => fake()->numberBetween(1, 20),
            'home_realm' => fake()->city(),
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
}
