<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        abort_if($request->user() && !$request->user()->isEmployee(), 403);

        $alreadyAuthenticated = Auth::check();
        $ownerId = Auth::id();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:'.(new User())->getTable().',email',
                'unique:'.(new Customer())->getTable().',email',
            ],
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = DB::transaction(function () use ($data, $alreadyAuthenticated, $ownerId): User {
            $user = new User([
                'name' => $data['name'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);
            $user->role = User::ROLE_CUSTOMER;
            $user->save();

            Customer::create([
                'name' => $data['name'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'user_id' => $alreadyAuthenticated ? $ownerId : $user->id,
            ]);

            return $user;
        });

        event(new Registered($user));

        if (!$alreadyAuthenticated) {
            Auth::login($user);
        }

        return redirect(route('product.view', absolute: false))
            ->with('success', 'Customer account created successfully.');
    }
}
