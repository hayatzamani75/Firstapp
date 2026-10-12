<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_visit_the_book_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/book')
            ->assertOk();
    }

    public function test_authenticated_user_can_create_a_book(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/book', [
                'name' => 'Laravel in Action',
                'title' => 'Best Practices',
                'description' => 'A practical guide to Laravel.',
            ])
            ->assertRedirect('/book');

        $this->assertDatabaseHas('books', [
            'user_id' => $user->id,
            'name' => 'Laravel in Action',
            'title' => 'Best Practices',
            'description' => 'A practical guide to Laravel.',
        ]);
    }
}
