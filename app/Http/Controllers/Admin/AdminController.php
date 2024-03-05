<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;

class AdminController extends AbstractAdminController
{
    /**
     * Adminトップ
     *
     * @return Application|Factory|View
     */
    public function top(): Application|Factory|View
    {
        return view('admin.top');
    }
}
