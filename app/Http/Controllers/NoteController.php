<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Http\Controllers\Controller;
use App\Http\Requests\Note\CreateNoteRequest;
use App\Http\Requests\Note\UpdateNoteRequest;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    /**
     * 
     * Display a paginated list of notes for the authenticated user.
     */
    public function view(): Response
    {
        $notes = Note::where('user_id', Auth::id())->latest()->paginate(12);
        return Inertia::render('Note/View', [
            'notes' => $notes,
        ]);
    }

    /**
     * Store a newly created note in the database.
     *
     * Associates the note with the currently authenticated user.
     *
     * @param \App\Http\Requests\Note\CreateNoteRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(CreateNoteRequest $request)
    {
        $user_id = Auth::id();

        Note::create([
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => $user_id,
        ]);

        return to_route('note.view')->with('success', 'Note created successfully!');
    }

    /**
     * Update the specified note.
     *
     * Only allows updating if the authenticated user owns the note.
     *
     * @param \App\Http\Requests\Note\UpdateNoteRequest $request
     * @param \App\Models\Note $note
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateNoteRequest $request, Note $note)
    {
        if ($note->user_id !== Auth::id()) abort(403, 'Unauthorized action.');

        $note->update($request->validated());
        return to_route('note.view')->with('success', 'Note updated successfully!');
    }

    /**
     * Remove the specified note from the database.
     *
     * Only allows deletion if the authenticated user owns the note.
     *
     * @param \App\Models\Note $note
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Note $note)
    {
        Log::info('User registered', ['note' => $note]);
        if ($note->user_id !== Auth::id()) abort(403, 'Unauthorized action.');

        $note->delete();
        return to_route('note.view')->with('success', 'Note deleted successfully!');
    }
}
