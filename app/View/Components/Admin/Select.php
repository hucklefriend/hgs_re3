<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Select extends Input
{
    public $list;

    /**
     * Create a new component instance.
     */
    public function __construct($name, $model, $list)
    {
        parent::__construct($name, $model);
        $this->list = $list;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $name = $this->name;
        return view('components.admin.select', [
            'selected' => $this->model->$name,
        ]);
    }
}
