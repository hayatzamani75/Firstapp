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

    public function test_customer_id_sort_can_be_toggled_in_both_directions(): void
    {
        $user = User::factory()->create();
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

        $this->actingAs($user)
            ->get('/customer?sort=id&direction=asc')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customer/View')
                ->where('sort', 'id')
                ->where('direction', 'asc')
                ->where('customers.data.0.id', $olderCustomer->id)
                ->where('customers.data.1.id', $newerCustomer->id));

        $this->get('/customer?sort=id&direction=desc')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customer/View')
                ->where('sort', 'id')
                ->where('direction', 'desc')
                ->where('customers.data.0.id', $newerCustomer->id)
                ->where('customers.data.1.id', $olderCustomer->id));
    }

    public function test_customer_sort_field_must_be_allowed(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/customer?sort=name&direction=desc')
            ->assertSessionHasErrors('sort');
    }

    public function test_customer_sort_is_preserved_in_pagination_links(): void
    {
        $user = User::factory()->create();

        foreach (range(1, 13) as $number) {
            \App\Models\Customer::create([
                'user_id' => $user->id,
                'name' => "Customer {$number}",
                'lastname' => 'Example',
                'email' => "customer{$number}@example.com",
            ]);
        }

        $this->actingAs($user)
            ->get('/customer?sort=id&direction=asc')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customer/View')
                ->where('customers.last_page', 2)
                ->where(
                    'customers.links.2.url',
                    route('customer.view', [
                        'sort' => 'id',
                        'direction' => 'asc',
                        'page' => 2,
                    ]),
                ));
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
