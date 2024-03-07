<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param  \Closure(Request): (Response|RedirectResponse)  $next
     * @return Response|RedirectResponse
     */
    public function handle(Request $request, Closure $next): Response|RedirectResponse
    {
        if ($route = $request->route()) {
            $action = $route->getAction();

            if (isset($action['controller'])) {
                $controller = class_basename($action['controller']);
                list($controller, $method) = explode('@', $controller);

                View::share('controllerName', mb_substr($controller, 0, -10));
            }
        }

        Paginator::useBootstrap();
        return $next($request);
    }
}
