<?php

namespace Database\Factories;

use App\Models\GameMaker;
use Illuminate\Database\Eloquent\Factories\Factory;

class GameMakerFactory extends Factory
{
    protected $model = GameMaker::class;

    public function definition(): array
    {
        return [
            'key' => $this->faker->unique()->word,
            'name' => $this->faker->company,
            'node_name' => $this->faker->slug,
            'type' => $this->faker->randomElement([1, 2, 3]),
            'description' => $this->faker->paragraph,
            'description_source' => $this->faker->url,
            'related_game_maker_id' => null,
        ];
    }
} 