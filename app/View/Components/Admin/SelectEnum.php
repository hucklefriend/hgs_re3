<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SelectEnum extends Select
{
    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $name = $this->name;
        return view('components.admin.select', [
            'selected' => $this->model?->$name?->value ?? $this->model?->$name,
        ]);
    }
}
