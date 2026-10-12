<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_visit_the_teacher_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/teacher')
            ->assertOk();
    }

    public function test_authenticated_user_can_create_a_teacher(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/teacher', [
                'name' => 'John',
                'lastname' => 'Doe',
                'position' => 'Math Teacher',
                'address' => '12 School Street',
            ])
            ->assertRedirect('/teacher');

        $this->assertDatabaseHas('teachers', [
            'user_id' => $user->id,
            'name' => 'John',
            'lastname' => 'Doe',
            'position' => 'Math Teacher',
            'address' => '12 School Street',
        ]);
    }
}
