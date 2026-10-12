<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_visit_the_company_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/company')
            ->assertOk();
    }

    public function test_authenticated_user_can_create_a_company(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/company', [
                'name' => 'Acme Corp',
                'type' => 'Technology',
                'address' => '123 Main Street',
            ])
            ->assertRedirect('/company');

        $this->assertDatabaseHas('companies', [
            'user_id' => $user->id,
            'name' => 'Acme Corp',
            'type' => 'Technology',
            'address' => '123 Main Street',
        ]);
    }
}
