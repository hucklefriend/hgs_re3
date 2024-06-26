<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SelectGamePlatformMulti extends Component
{
    public string $name;
    public bool $hasError;

    /**
     * Create a new component instance.
     */
    public function __construct($name)
    {
        $this->name = $name;
        $this->hasError = session('errors') && session('errors')->has($name);
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $list = \App\Models\MasterData\GamePlatform::all(['id', 'acronym'])->pluck('acronym', 'id')->toArray();
        return view('components.admin.select-game-platform-multi', [
            'list' => $list,
        ]);
    }
}