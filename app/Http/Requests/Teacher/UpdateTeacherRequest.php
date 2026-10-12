<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateTeacherRequest extends FormRequest
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
            'position' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('teachers', 'email')->ignore($this->route('teacher')),
            ],
            'phone_number_1' => ['nullable', 'string', 'regex:/\A[0-9]{10,14}\z/'],
            'phone_number_2' => ['nullable', 'string', 'regex:/\A[0-9]{10,14}\z/'],
            'address' => ['nullable', 'string', 'max:255'],
        ];
    }
}
