<?php

namespace App\View\Components\Admin;

use App\Models\Game\GameFranchise;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SelectGameFranchise extends Input
{
    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $name = $this->name;
        $list = GameFranchise::all(['id', 'name'])->pluck('name', 'id')->toArray();
        return view('components.admin.select', [
            'list' => ['' => '-'] + $list,
            'selected' => $this->model->$name,
        ]);
    }
}
