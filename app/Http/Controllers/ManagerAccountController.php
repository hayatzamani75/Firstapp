<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class ManagerAccountController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:30'],
            'password' => ['required', 'string', Password::defaults()],
        ]);

        $manager = new User([
            'name' => $data['name'],
            'lastname' => $data['lastname'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);
        $manager->forceFill([
            'phone' => $data['phone'],
            'role' => User::ROLE_MANAGER,
            'email_verified_at' => now(),
        ])->save();

        return back()->with('success', "Manager account for {$manager->name} {$manager->lastname} was created.");
    }
}
