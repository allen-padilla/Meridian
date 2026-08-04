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
        return [
            'name' => fake()->randomElement(['The Glass Citadel', 'Ashes of Dawn', 'The Hollow Road']),
            'summary' => fake()->sentence(),
            'location' => fake()->city(),
            'difficulty' => 'standard',
            'status' => 'upcoming',
            'starts_at' => now()->addWeek(),
            'party_limit' => 8,
            'requirements' => ['Bring a guild crest'],
        ];
    }
}
