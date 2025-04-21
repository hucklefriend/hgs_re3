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
            'h1_node_name' => $this->faker->company,
            'description' => $this->faker->paragraph,
            'description_source' => $this->faker->url,
            'related_game_maker_id' => null,
        ];
    }
} 