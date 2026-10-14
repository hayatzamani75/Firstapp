<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('manage-products', fn (User $user): bool => $user->isEmployee());
        Gate::define('manage-orders', fn (User $user): bool => $user->isEmployee());
        Gate::define('place-orders', fn (User $user): bool => $user->isCustomer());
        Gate::define('manage-employees', fn (User $user): bool => $user->isEmployee());

        // Force HTTPS in production environment for all generated URLs
        if (env('APP_ENV') === 'production') {
            URL::forceScheme('https');
        }
        Vite::prefetch(concurrency: 3);
    }
}
