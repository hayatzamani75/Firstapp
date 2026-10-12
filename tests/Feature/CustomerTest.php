<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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

    public function test_customers_are_listed_newest_first(): void
    {
        $user = User::factory()->create();
        $sameTimestamp = now();

        $olderCustomer = \App\Models\Customer::create([
            'user_id' => $user->id,
            'name' => 'Older',
            'lastname' => 'Customer',
            'email' => 'older@example.com',
        ]);
        $newerCustomer = \App\Models\Customer::create([
            'user_id' => $user->id,
            'name' => 'Newer',
            'lastname' => 'Customer',
            'email' => 'newer@example.com',
        ]);

        $olderCustomer->forceFill([
            'created_at' => $sameTimestamp,
            'updated_at' => $sameTimestamp,
        ])->save();
        $newerCustomer->forceFill([
            'created_at' => $sameTimestamp,
            'updated_at' => $sameTimestamp,
        ])->save();

        $this->actingAs($user)
            ->get('/customer')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customer/View')
                ->where('customers.data.0.id', $newerCustomer->id)
                ->where('customers.data.1.id', $olderCustomer->id));
    }

    public function test_authenticated_user_can_create_a_customer(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/customer', [
                'name' => 'Alice',
                'lastname' => 'Johnson',
                'email' => 'alice.johnson@example.com',
                'address' => '15 Main Street',
            ])
            ->assertRedirect('/customer');

        $this->assertDatabaseHas('customers', [
            'user_id' => $user->id,
            'name' => 'Alice',
            'lastname' => 'Johnson',
            'email' => 'alice.johnson@example.com',
            'address' => '15 Main Street',
        ]);
    }

    public function test_customer_email_must_be_unique(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/customer', [
            'name' => 'Alice',
            'lastname' => 'Johnson',
            'email' => 'alice.johnson@example.com',
        ])->assertRedirect();

        $this->actingAs($user)->post('/customer', [
            'name' => 'Alicia',
            'lastname' => 'Jones',
            'email' => 'alice.johnson@example.com',
        ])->assertSessionHasErrors('email');
    }

    public function test_customer_can_keep_the_same_email_when_updated(): void
    {
        $user = User::factory()->create();
        $customer = \App\Models\Customer::create([
            'user_id' => $user->id,
            'name' => 'Alice',
            'lastname' => 'Johnson',
            'email' => 'alice.johnson@example.com',
        ]);

        $this->actingAs($user)->put("/customer/{$customer->id}", [
            'name' => 'Alice',
            'lastname' => 'Johnson',
            'email' => 'alice.johnson@example.com',
        ])->assertRedirect('/customer');

        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'email' => 'alice.johnson@example.com',
        ]);
    }
}
