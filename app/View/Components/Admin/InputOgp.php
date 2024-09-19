<?php

namespace App\View\Components\Admin;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class InputOgp extends Input
{
    public string $name;
    public bool $hasError;
    public mixed $model;

    /**
     * Create a new component instance.
     */
    public function __construct($name, $model)
    {
        parent::__construct($name, $model);
        $this->value = $model->ogp?->url ?? '';
    }
}
