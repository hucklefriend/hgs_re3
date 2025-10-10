<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Http\Middleware\CrossOriginHeaders;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->redirectGuestsTo(function (Request $request) {

            if ($request->routeIs('Admin.*')) {
                return route('Admin.Login');
            }

            return route('Root');
        });

        $middleware->appendToGroup('admin', [
            \App\Http\Middleware\Admin::class,
            \App\Http\Middleware\AdminSearchBreadcrumb::class,
        ]);

        $middleware->alias([
            'gpts.api_key' => \App\Http\Middleware\GptsApiKeyMiddleware::class,
        ]);

        //$middleware->append(CrossOriginHeaders::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
