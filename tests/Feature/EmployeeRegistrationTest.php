<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EmployeeRegistrationTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Ahmad',
            'lastname' => 'Zamani',
            'username' => 'ahmad.zamani',
            'password' => 'SuperSecret1',
            'password_confirmation' => 'SuperSecret1',
        ], $overrides);
    }

    private function employee(): User
    {
        $employee = User::factory()->create();
        $employee->forceFill(['role' => User::ROLE_EMPLOYEE])->save();

        return $employee;
    }

    public function test_employee_can_register_a_new_employee_account(): void
    {
        $this->actingAs($this->employee())
            ->post(route('employee.account.store'), $this->validPayload())
            ->assertRedirect()
            ->assertSessionHas('success');

        $created = User::query()->where('username', 'ahmad.zamani')->firstOrFail();

        $this->assertSame(User::ROLE_EMPLOYEE, $created->role);
        $this->assertSame('Ahmad', $created->name);
        $this->assertSame('Zamani', $created->lastname);
        $this->assertTrue(Hash::check('SuperSecret1', $created->password));
        $this->assertNotNull($created->email_verified_at);
    }

    public function test_newly_registered_employee_can_log_in_with_username(): void
    {
        $this->actingAs($this->employee())
            ->post(route('employee.account.store'), $this->validPayload());

        // Sign out so the login request is handled as a guest.
        $this->post('/logout');

        $response = $this->post('/login', [
            'email' => 'ahmad.zamani',
            'password' => 'SuperSecret1',
        ]);

        $this->assertAuthenticated();
        $this->assertSame(
            'ahmad.zamani',
            auth()->user()->username,
        );
        $response->assertRedirect(route('product.view', absolute: false));
    }

    public function test_registered_employee_can_add_edit_and_delete_products(): void
    {
        Storage::fake('public');

        $this->actingAs($this->employee())
            ->post(route('employee.account.store'), $this->validPayload());

        $employee = User::query()->where('username', 'ahmad.zamani')->firstOrFail();

        // Add
        $this->actingAs($employee)
            ->post(route('product.store'), [
                'image' => UploadedFile::fake()->image('shoe.png'),
                'name' => 'Runner Shoe',
                'category' => 'Shoes',
                'price' => '99.00',
                'stock_quantity' => 4,
            ])
            ->assertRedirect(route('product.view'));

        $product = Product::firstOrFail();
        $this->assertSame('Runner Shoe', $product->name);

        // Edit
        $this->actingAs($employee)
            ->put(route('product.update', $product), [
                'name' => 'Runner Shoe V2',
                'category' => 'Shoes',
                'price' => '120.00',
                'stock_quantity' => 6,
            ])
            ->assertRedirect();

        $this->assertSame('Runner Shoe V2', $product->fresh()->name);

        // Delete
        $this->actingAs($employee)
            ->delete(route('product.destroy', $product))
            ->assertRedirect();

        $this->assertDatabaseCount('products', 0);
    }

    public function test_customer_cannot_register_employee_accounts(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER]);

        $this->actingAs($customer)
            ->post(route('employee.account.store'), $this->validPayload())
            ->assertForbidden();

        $this->assertDatabaseCount('users', 1);
    }

    public function test_guest_cannot_register_employee_accounts(): void
    {
        $this->post(route('employee.account.store'), $this->validPayload())
            ->assertRedirect(route('login'));

        $this->assertDatabaseCount('users', 0);
    }

    public function test_username_must_be_unique(): void
    {
        $this->actingAs($this->employee())
            ->post(route('employee.account.store'), $this->validPayload());

        $this->actingAs($this->employee())
            ->from(route('dashboard'))
            ->post(route('employee.account.store'), $this->validPayload())
            ->assertSessionHasErrors('username');
    }

    public function test_passwords_must_match(): void
    {
        $this->actingAs($this->employee())
            ->from(route('dashboard'))
            ->post(route('employee.account.store'), $this->validPayload([
                'password' => 'SuperSecret1',
                'password_confirmation' => 'DifferentSecret1',
            ]))
            ->assertSessionHasErrors('password');
    }

    public function test_registration_requires_a_username_and_password(): void
    {
        $this->actingAs($this->employee())
            ->from(route('dashboard'))
            ->post(route('employee.account.store'), [
                'name' => 'Ahmad',
                'lastname' => 'Zamani',
                'username' => '',
                'password' => '',
                'password_confirmation' => '',
            ])
            ->assertSessionHasErrors(['username', 'password']);

        $this->assertDatabaseCount('users', 1);
    }

    public function test_customer_can_still_log_in_with_email(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER]);

        $response = $this->post('/login', [
            'email' => $customer->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($customer);
        $response->assertRedirect(route('product.view', absolute: false));
    }
}
