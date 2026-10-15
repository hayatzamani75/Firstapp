<?php

namespace App\Http\Controllers;

use App\Http\Requests\Customer\CreateCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function view(Request $request): Response
    {
        $validated = $request->validate([
            'sort' => ['sometimes', 'string', Rule::in(['id'])],
            'direction' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
        ]);

        $sort = $validated['sort'] ?? 'id';
        $direction = $validated['direction'] ?? 'asc';

        $customers = Customer::query()
            ->orderBy($sort, $direction)
            ->paginate(8)
            ->appends(['sort' => $sort, 'direction' => $direction]);

        return Inertia::render('Customer/View', [
            'customers' => $customers,
            'sort' => $sort,
            'direction' => $direction,
        ]);
    }

    public function store(CreateCustomerRequest $request)
    {
        $data = $request->validated();

        $customerUser = DB::transaction(function () use ($data): User {
            $customerUser = new User([
                'name' => $data['name'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);
            $customerUser->role = User::ROLE_CUSTOMER;
            $customerUser->save();

            Customer::create([
                'name' => $data['name'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'user_id' => Auth::id(),
            ]);

            return $customerUser;
        });

        event(new Registered($customerUser));

        return to_route('customer.view')->with('success', 'Customer record and login account created successfully.');
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        return to_route('customer.view')->with('success', 'Customer updated successfully!');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return to_route('customer.view')->with('success', 'Customer deleted successfully!');
    }
}
