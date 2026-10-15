<?php

namespace App\Http\Controllers;

use App\Http\Requests\Internship\CreateInternshipRequest;
use App\Http\Requests\Internship\UpdateInternshipRequest;
use App\Models\Internship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InternshipController extends Controller
{
    public function view(Request $request): Response
    {
        $validated = $request->validate([
            'sort' => ['sometimes', 'string', Rule::in(['id'])],
            'direction' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
        ]);

        $sort = $validated['sort'] ?? 'id';
        $direction = $validated['direction'] ?? 'desc';

        $internships = Internship::query()
            ->orderBy($sort, $direction)
            ->paginate(12)
            ->appends(['sort' => $sort, 'direction' => $direction]);

        return Inertia::render('Internship/View', [
            'internships' => $internships,
            'sort' => $sort,
            'direction' => $direction,
        ]);
    }

    public function store(CreateInternshipRequest $request)
    {
        Internship::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        return to_route('internship.view')->with('success', 'Internship created successfully!');
    }

    public function update(UpdateInternshipRequest $request, Internship $internship)
    {
        $internship->update($request->validated());

        return to_route('internship.view')->with('success', 'Internship updated successfully!');
    }

    public function destroy(Internship $internship)
    {
        $internship->delete();

        return to_route('internship.view')->with('success', 'Internship deleted successfully!');
    }

}
