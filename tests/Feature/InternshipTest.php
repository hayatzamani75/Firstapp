<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InternshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_an_internship(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/internship', [
                'name' => 'Alex',
                'lastname' => 'Morgan',
                'phone' => '1234567890',
                'email' => 'alex@example.com',
                'address' => '123 Main St',
                'contract' => 'Full-time',
            ]);

        $response->assertRedirect('/internship');
        $this->assertDatabaseHas('internships', [
            'email' => 'alex@example.com',
            'user_id' => $user->id,
        ]);
    }
}
