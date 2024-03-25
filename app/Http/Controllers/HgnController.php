<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Admin\AbstractAdminController;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

class HgnController extends Controller
{
    /**
     * トップページ
     *
     * @return Application|Factory|View
     */
    public function index(): Application|Factory|View
    {
        if (!App::environment('local')) {
            return view('suspend');
        }

        return view('index');
    }
}
