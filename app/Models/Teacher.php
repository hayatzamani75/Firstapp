<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Teacher extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'lastname',
        'position',
        'email',
        'phone_number_1',
        'phone_number_2',
        'address',
        'user_id',
    ];

    protected $attributes = [
        'address' => null,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
