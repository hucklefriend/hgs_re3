<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SelectShop extends SelectEnum
{
    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $name = $this->name;
        return view('components.admin.select-shop', [
            'selected' => $this->model?->$name?->value ?? $this->model?->$name,
        ]);
    }
}

