<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class MultiEditSelectEnum extends Select
{
    public string $columnName;

    /**
     * Create a new component instance.
     */
    public function __construct($name, $model, $list, $forceSelect = null)
    {
        parent::__construct($name, $model, $list, $forceSelect);

        $this->columnName = $name;
        $this->name = $name . '[' . $model->id . ']';
        $this->hasError = session('errors') && session('errors')->has($name . '.' . $model->id);
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $columnName = $this->columnName;
        return view('components.admin.multi-edit-select-enum', [
            'selected' => $this->forceSelect === null ? $this->model->$columnName?->value : $this->forceSelect,
        ]);
    }
}
