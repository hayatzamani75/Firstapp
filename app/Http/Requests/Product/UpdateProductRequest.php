<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'name' => ['required', 'string', 'max:255'],
            'category' => [
                'required',
                'string',
                Rule::in([
                    "Men's Clothing",
                    "Women's Clothing",
                    'Clothing',
                    'Shoes',
                    'Boots',
                    'Sportswear',
                    'Bags',
                    'Accessories',
                ]),
            ],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'brand' => ['nullable', 'string', 'max:120'],
            'sizes' => ['nullable', 'array', 'max:20'],
            'sizes.*' => ['required', 'string', 'max:50'],
            'colors' => ['nullable', 'array', 'max:20'],
            'colors.*' => ['required', 'string', 'max:50'],
            'stock_quantity' => ['required', 'integer', 'min:0', 'max:1000000'],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($this->route('product'))],
        ];
    }
}
