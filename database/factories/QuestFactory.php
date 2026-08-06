<?php

namespace Database\Factories;

use App\Models\Quest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quest>
 */
class QuestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isPast = fake()->boolean(55);
        $startsAt = $isPast
            ? fake()->dateTimeBetween('-12 months', '-2 days')
            : fake()->dateTimeBetween('+1 day', '+6 months');

        return [
            'name' => fake()->randomElement([
                'The Glass Citadel', 'Ashes of Dawn', 'The Hollow Road',
                'Vault of Tides', 'The Lantern March', 'Siege of Frostmere',
                'Echoes Beneath Alderkeep', 'The Silver Crossing',
            ]).' '.fake()->unique()->numerify('##'),
            'summary' => fake()->sentence(12),
            'location' => fake()->randomElement([
                'Astra Peaks', 'Thornmere Marsh', 'Copperwind Pass',
                'Elderbloom', 'Blackwater Reach', 'Frostmere', 'Dawnmere',
            ]),
            'difficulty' => fake()->randomElement(['standard', 'standard', 'epic', 'legendary']),
            'status' => $isPast ? 'completed' : 'upcoming',
            'starts_at' => $startsAt,
            'ends_at' => (clone $startsAt)->modify('+'.fake()->numberBetween(3, 12).' hours'),
            'party_limit' => fake()->numberBetween(6, 14),
            'requirements' => fake()->randomElements([
                'Bring a guild crest', 'Prepare two days of provisions',
                'Cold-weather gear required', 'Carry a healing draught',
                'Report to muster thirty minutes early',
            ], 2),
        ];
    }
}
