<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_visit_the_customer_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/customer')
            ->assertOk();
    }

    public function test_authenticated_user_can_create_a_customer(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/customer', [
                'name' => 'Alice',
                'lastname' => 'Johnson',
                'address' => '15 Main Street',
            ])
            ->assertRedirect('/customer');

        $this->assertDatabaseHas('customers', [
            'user_id' => $user->id,
            'name' => 'Alice',
            'lastname' => 'Johnson',
            'address' => '15 Main Street',
        ]);
    }
}
