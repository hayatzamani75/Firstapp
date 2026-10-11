<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Note extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    protected $fillable = ['title', 'description', 'user_id'];
    protected $attributes = [
        'description' => null,
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}
