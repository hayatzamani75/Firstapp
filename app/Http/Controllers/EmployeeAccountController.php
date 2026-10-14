<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class EmployeeAccountController extends Controller
{
    /**
     * Internal e-mail domain used for staff accounts that sign in with a username.
     */
    private const ACCOUNT_EMAIL_DOMAIN = 'employees.kic.local';

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $username = $data['username'];

        $user = new User([
            'name' => $data['name'],
            'lastname' => $data['lastname'],
            'username' => $username,
            'password' => $data['password'],
        ]);

        // The users table requires a unique e-mail address. Employee accounts sign
        // in with their username, so a stable placeholder address is derived from it.
        $user->forceFill([
            'email' => $this->accountEmail($username),
            'role' => User::ROLE_EMPLOYEE,
            'email_verified_at' => now(),
        ])->save();

        return back()->with(
            'success',
            "Employee account for {$data['name']} {$data['lastname']} was created. They can now add, edit and delete products."
        );
    }

    private function accountEmail(string $username): string
    {
        $localPart = Str::slug($username, '.');

        if ($localPart === '') {
            $localPart = 'employee-'.Str::lower(Str::random(8));
        }

        return $localPart.'@'.self::ACCOUNT_EMAIL_DOMAIN;
    }
}
