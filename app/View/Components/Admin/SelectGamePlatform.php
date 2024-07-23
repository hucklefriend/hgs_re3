<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SelectGamePlatform extends Input
{
    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $name = $this->name;
        $list = \App\Models\MasterData\GamePlatform::all(['id', 'name', 'sort_order'])
            ->sortBy('sort_order')
            ->pluck('name', 'id')
            ->toArray();
        return view('components.admin.select', [
            'list' => ['' => '-'] + $list,
            'selected' => $this->model->$name,
        ]);
    }
}
