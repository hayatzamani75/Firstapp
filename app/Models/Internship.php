<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Internship extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'lastname',
        'phone',
        'email',
        'address',
        'contract',
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
