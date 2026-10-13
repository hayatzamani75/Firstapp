<?php

namespace App\Http\Controllers;

use App\Http\Requests\Customer\CreateCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $customers = Customer::where('user_id', Auth::id())
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
        Customer::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'phone' => $request->phone,
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
