<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'employee',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('product.view', absolute: false));
        $this->assertSame(
            User::ROLE_CUSTOMER,
            User::query()->where('email', 'test@example.com')->value('role'),
        );
    }
}
