<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('users:promote-to-employee {email}', function (string $email) {
    $user = User::query()->where('email', $email)->first();

    if (!$user) {
        $this->error("No account found for {$email}.");

        return 1;
    }

    $user->forceFill(['role' => User::ROLE_EMPLOYEE])->save();
    $this->info("{$user->email} can now manage products and orders.");

    return 0;
})->purpose('Promote an existing registered account to employee');
