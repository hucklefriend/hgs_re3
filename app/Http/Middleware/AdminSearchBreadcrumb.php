<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class AdminSearchBreadcrumb
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 現在のルートの名前を取得
        $currentRouteName = Route::currentRouteName();

        // preg_matchで正規表現を使って、Admin.Game.(アルファベットと数字).の文字列を取得
        if (preg_match('/Admin\.Game\.([a-zA-Z0-9]+)\./', $currentRouteName, $matches)) {
            $search = session('search_' . $matches[1], []);
            View::share('overwriteBreadcrumb', [
                $matches[1] => route('Admin.Game.' . $matches[1], $search),
            ]);
        }

        return $next($request);
    }
}
