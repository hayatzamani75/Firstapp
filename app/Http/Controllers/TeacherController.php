<?php

namespace App\Http\Controllers;

use App\Http\Requests\Teacher\CreateTeacherRequest;
use App\Http\Requests\Teacher\UpdateTeacherRequest;
use App\Models\Teacher;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function view(): Response
    {
        $teachers = Teacher::where('user_id', Auth::id())->latest()->paginate(12);

        return Inertia::render('Teacher/View', [
            'teachers' => $teachers,
        ]);
    }

    public function store(CreateTeacherRequest $request)
    {
        Teacher::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'position' => $request->position,
            'email' => $request->email,
            'phone_number_1' => $request->phone_number_1,
            'phone_number_2' => $request->phone_number_2,
            'address' => $request->address,
            'user_id' => Auth::id(),
        ]);

        return to_route('teacher.view')->with('success', 'Teacher created successfully!');
    }

    public function update(UpdateTeacherRequest $request, Teacher $teacher)
    {
        if ($teacher->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $teacher->update($request->validated());

        return to_route('teacher.view')->with('success', 'Teacher updated successfully!');
    }

    public function destroy(Teacher $teacher)
    {
        if ($teacher->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $teacher->delete();

        return to_route('teacher.view')->with('success', 'Teacher deleted successfully!');
    }
}
