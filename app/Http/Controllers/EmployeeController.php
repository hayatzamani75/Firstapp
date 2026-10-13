<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\CreateEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function view(): Response
    {
        return Inertia::render('Employee/View', [
            'employees' => Employee::where('user_id', Auth::id())
                ->orderByDesc('id')
                ->paginate(2),
        ]);
    }

    public function store(CreateEmployeeRequest $request)
    {
        Employee::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        return to_route('employee.view')->with('success', 'Employee created successfully!');
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $this->authorizeEmployee($employee);
        $employee->update($request->validated());

        return to_route('employee.view')->with('success', 'Employee updated successfully!');
    }

    public function destroy(Employee $employee)
    {
        $this->authorizeEmployee($employee);
        $employee->delete();

        return to_route('employee.view')->with('success', 'Employee deleted successfully!');
    }

    private function authorizeEmployee(Employee $employee): void
    {
        abort_unless($employee->user_id === Auth::id(), 403, 'Unauthorized action.');
    }
}