<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Faker\Calculator\Ean;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CrossOriginHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('Cross-Origin-Embedder-Policy', 'require-corp');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Resource-Policy', 'cross-origin');
        $response->headers->set('Cross-Origin-Isolation', 'same-origin');
        $response->headers->set('Access-Control-Allow-Origin', '*'); // 必要に応じて追加
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 必要に応じて追加
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
