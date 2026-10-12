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
                'email' => 'john.doe@example.com',
                'address' => '12 School Street',
            ])
            ->assertRedirect('/teacher');

        $this->assertDatabaseHas('teachers', [
            'user_id' => $user->id,
            'name' => 'John',
            'lastname' => 'Doe',
            'position' => 'Math Teacher',
            'email' => 'john.doe@example.com',
            'address' => '12 School Street',
        ]);
    }

    public function test_teacher_email_must_be_unique(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/teacher', [
            'name' => 'John',
            'lastname' => 'Doe',
            'position' => 'Math Teacher',
            'email' => 'john.doe@example.com',
        ])->assertRedirect();

        $this->actingAs($user)->post('/teacher', [
            'name' => 'Jane',
            'lastname' => 'Doe',
            'position' => 'Science Teacher',
            'email' => 'john.doe@example.com',
        ])->assertSessionHasErrors('email');
    }

    public function test_teacher_can_keep_the_same_email_when_updated(): void
    {
        $user = User::factory()->create();
        $teacher = \App\Models\Teacher::create([
            'user_id' => $user->id,
            'name' => 'John',
            'lastname' => 'Doe',
            'position' => 'Math Teacher',
            'email' => 'john.doe@example.com',
        ]);

        $this->actingAs($user)->put("/teacher/{$teacher->id}", [
            'name' => 'John',
            'lastname' => 'Doe',
            'position' => 'Senior Math Teacher',
            'email' => 'john.doe@example.com',
        ])->assertRedirect('/teacher');

        $this->assertDatabaseHas('teachers', [
            'id' => $teacher->id,
            'position' => 'Senior Math Teacher',
            'email' => 'john.doe@example.com',
        ]);
    }
}
