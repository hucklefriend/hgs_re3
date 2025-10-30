<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SelectGamePlatformMulti extends Component
{
    public string $name;
    public mixed $selected;
    public bool $hasError;

    /**
     * Create a new component instance.
     */
    public function __construct($name, $selected = [])
    {
        $this->name = $name;
        $this->selected = $selected;
        $this->hasError = session('errors') && session('errors')->has($name);
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $list = \App\Models\GamePlatform::all(['id', 'name', 'sort_order'])
            ->sortBy('sort_order')
            ->pluck('name', 'id')
            ->toArray();
        return view('components.admin.select-multi', [
            'list' => $list
        ]);
    }
}
