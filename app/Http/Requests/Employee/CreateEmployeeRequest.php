<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class CreateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/\A[0-9]{10,14}\z/'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email', 'unique:users,email'],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
            'address' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
