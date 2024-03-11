<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // 'admin'ゲートを定義
        Gate::define('admin', function ($user) {
            return ($user->role >= \App\Enums\UserRole::ADMIN->value);
        });

        // 'editor'ゲートを定義
        Gate::define('editor', function ($user) {
            return ($user->role >= \App\Enums\UserRole::EDITOR->value);
        });
    }
}
