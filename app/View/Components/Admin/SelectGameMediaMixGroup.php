<?php

namespace App\View\Components\Admin;

use App\Models\Game\GameFranchise;
use App\Models\Game\GameMediaMixGroup;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SelectGameMediaMixGroup extends Input
{
    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $name = $this->name;
        $list = [];
        foreach (GameMediaMixGroup::all() as $mediaMixGroup) {
            $list[$mediaMixGroup->id] = sprintf("[%s]%s", $mediaMixGroup->franchise->name ?? '--', $mediaMixGroup->name);
        }

        return view('components.admin.select', [
            'list' => ['' => '-'] + $list,
            'selected' => $this->model->$name,
        ]);
    }
}
