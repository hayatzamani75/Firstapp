<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\CreateBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function view(): Response
    {
        $books = Book::query()->latest()->paginate(12);

        return Inertia::render('Book/View', [
            'books' => $books,
        ]);
    }

    public function store(CreateBookRequest $request)
    {
        Book::create([
            'name' => $request->name,
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => Auth::id(),
        ]);

        return to_route('book.view')->with('success', 'Book created successfully!');
    }

    public function update(UpdateBookRequest $request, Book $book)
    {
        $book->update($request->validated());

        return to_route('book.view')->with('success', 'Book updated successfully!');
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return to_route('book.view')->with('success', 'Book deleted successfully!');
    }
}
