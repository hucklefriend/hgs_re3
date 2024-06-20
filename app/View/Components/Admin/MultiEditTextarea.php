<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class MultiEditTextarea extends Input
{
    public string $columnName;

    /**
     * Create a new component instance.
     */
    public function __construct($name, $model)
    {
        parent::__construct($name, $model);

        $this->columnName = $name;
        $this->name = $name . '[' . $model->id . ']';
        $this->hasError = session('errors') && session('errors')->has($name . '.' . $model->id);
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.admin.multi-edit-textarea');
    }
}
