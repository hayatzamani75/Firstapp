<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'created_by',
        'name',
        'category',
        'description',
        'price',
        'discount_price',
        'brand',
        'sizes',
        'colors',
        'stock_quantity',
        'sku',
        'image_path',
    ];

    protected $appends = ['image_url', 'effective_price'];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discount_price' => 'decimal:2',
            'sizes' => 'array',
            'colors' => 'array',
            'stock_quantity' => 'integer',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }

    public function getEffectivePriceAttribute(): float
    {
        $price = (float) $this->price;
        $discountPrice = $this->discount_price === null ? null : (float) $this->discount_price;

        return $discountPrice !== null && $discountPrice < $price ? $discountPrice : $price;
    }
}