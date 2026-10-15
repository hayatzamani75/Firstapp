<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\CreateEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function view(): Response
    {
        return Inertia::render('Employee/View', [
            'employees' => Employee::query()
                ->orderByDesc('id')
                ->paginate(2),
        ]);
    }

    public function store(CreateEmployeeRequest $request)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data): void {
            $user = new User([
                'name' => $data['name'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);
            $user->forceFill([
                'role' => User::ROLE_EMPLOYEE,
                'email_verified_at' => now(),
            ])->save();

            Employee::create([
                'name' => $data['name'],
                'lastname' => $data['lastname'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'address' => $data['address'] ?? null,
                'user_id' => Auth::id(),
            ]);
        });

        return to_route('employee.view')->with('success', 'Employee record and login account created successfully. The employee can log in using their email and password.');
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->validated());

        return to_route('employee.view')->with('success', 'Employee updated successfully!');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return to_route('employee.view')->with('success', 'Employee deleted successfully!');
    }

}
