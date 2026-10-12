<?php

namespace App\Http\Controllers;

use App\Http\Requests\Customer\CreateCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function view(): Response
    {
        $customers = Customer::where('user_id', Auth::id())->latest()->paginate(12);

        return Inertia::render('Customer/View', [
            'customers' => $customers,
        ]);
    }

    public function store(CreateCustomerRequest $request)
    {
        Customer::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'address' => $request->address,
            'user_id' => Auth::id(),
        ]);

        return to_route('customer.view')->with('success', 'Customer created successfully!');
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        if ($customer->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $customer->update($request->validated());

        return to_route('customer.view')->with('success', 'Customer updated successfully!');
    }

    public function destroy(Customer $customer)
    {
        if ($customer->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $customer->delete();

        return to_route('customer.view')->with('success', 'Customer deleted successfully!');
    }
}
