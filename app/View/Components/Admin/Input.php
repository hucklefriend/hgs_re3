<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Input extends Component
{
    public string $name;
    public bool $hasError;
    public mixed $model;
    public mixed $value;

    /**
     * Create a new component instance.
     */
    public function __construct($name, $model)
    {
        $this->name = $name;
        $this->model = $model;
        $this->hasError = session('errors') && session('errors')->has($name);
        $this->value = $model->$name ?? '';
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.admin.input');
    }
}
