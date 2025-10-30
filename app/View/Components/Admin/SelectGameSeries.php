<?php

namespace App\View\Components\Admin;

use App\Models\GameSeries;
use Closure;
use Illuminate\Contracts\View\View;

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
