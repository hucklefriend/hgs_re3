<?php

namespace App\View\Components\Admin;

use App\Models\Game\GamePlatform;
use App\Models\Game\GameSeries;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SelectGameSeries extends Input
{
    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $name = $this->name;
        $list = GameSeries::all(['id', 'name', 'phonetic'])
            ->sortBy('phonetic')
            ->pluck('name', 'id')
            ->toArray();
        return view('components.admin.select', [
            'list' => ['' => '-'] + $list,
            'selected' => $this->model->$name,
        ]);
    }
}
