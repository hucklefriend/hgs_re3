<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Http\Middleware\CrossOriginHeaders;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->redirectGuestsTo(function (Request $request) {

            if ($request->routeIs('Admin.*')) {
                return route('Admin.Login');
            }

            return route('Entrance');
        });

        $middleware->appendToGroup('admin', [
            \App\Http\Middleware\Admin::class,
            \App\Http\Middleware\AdminSearchBreadcrumb::class,
        ]);

        $middleware->append(CrossOriginHeaders::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
