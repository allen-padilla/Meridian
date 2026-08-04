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
        return [
            'hero_code' => 'M-'.fake()->unique()->numerify('####'),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'ancestry' => fake()->randomElement(['Human', 'High Elf', 'Mountain Dwarf']),
            'class' => fake()->randomElement(['Ranger', 'Guardian', 'Spellblade']),
            'level' => fake()->numberBetween(1, 20),
            'home_realm' => fake()->city(),
            'faction' => fake()->randomElement(['Crimson Accord', 'Verdant Circle', 'Iron Covenant']),
            'verification_status' => 'verified',
            'standing_status' => 'confirmed',
        ];
    }
}
