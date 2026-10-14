<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'category' => ['sometimes', 'nullable', 'string', 'max:100'],
            'collection' => ['sometimes', 'string', Rule::in(['all', 'new', 'sale'])],
            'sort' => ['sometimes', 'string', Rule::in(['newest', 'price_asc', 'price_desc'])],
            'price_min' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'price_max' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'size' => ['sometimes', 'nullable', 'string', 'max:50'],
            'color' => ['sometimes', 'nullable', 'string', 'max:50'],
            'brand' => ['sometimes', 'nullable', 'string', 'max:120'],
            'availability' => ['sometimes', 'nullable', Rule::in(['in_stock', 'out_of_stock'])],
        ]);

        $filters = array_merge([
            'search' => '',
            'category' => '',
            'collection' => 'all',
            'sort' => 'newest',
            'price_min' => '',
            'price_max' => '',
            'size' => '',
            'color' => '',
            'brand' => '',
            'availability' => '',
        ], $filters);

        $query = Product::query();

        if ($filters['search'] !== '') {
            $search = $filters['search'];
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($filters['category'] !== '') {
            $query->where('category', $filters['category']);
        }

        if ($filters['collection'] === 'new') {
            $query->where('created_at', '>=', now()->subDays(30));
        } elseif ($filters['collection'] === 'sale') {
            $query->whereNotNull('discount_price')
                ->whereColumn('discount_price', '<', 'price');
        }

        if ($filters['price_min'] !== '') {
            $query->whereRaw('COALESCE(discount_price, price) >= ?', [$filters['price_min']]);
        }

        if ($filters['price_max'] !== '') {
            $query->whereRaw('COALESCE(discount_price, price) <= ?', [$filters['price_max']]);
        }

        if ($filters['size'] !== '') {
            $query->whereJsonContains('sizes', $filters['size']);
        }

        if ($filters['color'] !== '') {
            $query->whereJsonContains('colors', $filters['color']);
        }

        if ($filters['brand'] !== '') {
            $query->where('brand', $filters['brand']);
        }

        if ($filters['availability'] === 'in_stock') {
            $query->where('stock_quantity', '>', 0);
        } elseif ($filters['availability'] === 'out_of_stock') {
            $query->where('stock_quantity', 0);
        }

        match ($filters['sort']) {
            'price_asc' => $query->orderByRaw('COALESCE(discount_price, price) asc'),
            'price_desc' => $query->orderByRaw('COALESCE(discount_price, price) desc'),
            default => $query->latest(),
        };

        $products = $query->paginate(12)->withQueryString();
        $variants = Product::query()->get(['sizes', 'colors']);
        $cartItems = $this->cartItems();

        return Inertia::render('Product', [
            'products' => $products,
            'categories' => Product::query()->distinct()->orderBy('category')->pluck('category'),
            'filterOptions' => [
                'sizes' => $variants->flatMap(fn (Product $product) => $product->sizes ?? [])->filter()->unique()->sort()->values(),
                'colors' => $variants->flatMap(fn (Product $product) => $product->colors ?? [])->filter()->unique()->sort()->values(),
                'brands' => Product::query()->whereNotNull('brand')->where('brand', '<>', '')->distinct()->orderBy('brand')->pluck('brand'),
            ],
            'filters' => $filters,
            'cartItems' => $cartItems,
            'cartCount' => collect($cartItems)->sum('quantity'),
            'cartTotal' => round(collect($cartItems)->sum('subtotal'), 2),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $imagePath = $request->file('image')->store('products', 'public');

        if (!$imagePath) {
            throw ValidationException::withMessages([
                'image' => 'The product image could not be stored. Please try again.',
            ]);
        }

        try {
            Product::create([
                'created_by' => $request->user()->id,
                'name' => $data['name'],
                'category' => $data['category'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'discount_price' => $data['discount_price'] ?? null,
                'brand' => $data['brand'] ?? null,
                'sizes' => $data['sizes'] ?? null,
                'colors' => $data['colors'] ?? null,
                'stock_quantity' => $data['stock_quantity'],
                'sku' => $data['sku'] ?? null,
                'image_path' => $imagePath,
            ]);
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($imagePath);
            throw $exception;
        }

        return to_route('product.view')->with('success', 'Product added successfully.');
    }

    public function addToCart(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'size' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);
        $product = Product::findOrFail($data['product_id']);
        $this->validateOptions($product, $data);

        if ($product->stock_quantity < 1) {
            throw ValidationException::withMessages(['cart' => 'This product is out of stock.']);
        }

        $size = $data['size'] ?? null;
        $color = $data['color'] ?? null;
        $key = $this->cartKey($product->id, $size, $color);
        $cart = session()->get('product_cart', []);
        $quantity = ($cart[$key]['quantity'] ?? 0) + $data['quantity'];

        if ($quantity > $product->stock_quantity) {
            throw ValidationException::withMessages(['cart' => 'The requested quantity exceeds available stock.']);
        }

        $cart[$key] = [
            'product_id' => $product->id,
            'size' => $size,
            'color' => $color,
            'quantity' => $quantity,
        ];
        session()->put('product_cart', $cart);

        return back()->with('success', 'Product added to your cart.');
    }

    public function updateCart(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'item_key' => ['required', 'string', 'size:64'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);
        $cart = session()->get('product_cart', []);
        $item = $cart[$data['item_key']] ?? null;

        if (!$item) {
            throw ValidationException::withMessages(['cart' => 'This cart item is no longer available.']);
        }

        $product = Product::find($item['product_id']);

        if (!$product || $data['quantity'] > $product->stock_quantity) {
            throw ValidationException::withMessages(['cart' => 'The requested quantity exceeds available stock.']);
        }

        $cart[$data['item_key']]['quantity'] = $data['quantity'];
        session()->put('product_cart', $cart);

        return back()->with('success', 'Cart quantity updated.');
    }

    public function removeFromCart(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'item_key' => ['required', 'string', 'size:64'],
        ]);
        $cart = session()->get('product_cart', []);
        unset($cart[$data['item_key']]);
        session()->put('product_cart', $cart);

        return back()->with('success', 'Product removed from your cart.');
    }

    private function validateOptions(Product $product, array $data): void
    {
        foreach (['size' => 'sizes', 'color' => 'colors'] as $field => $attribute) {
            $options = $product->{$attribute} ?? [];
            $value = $data[$field] ?? null;

            if ($options && (!$value || !in_array($value, $options, true))) {
                throw ValidationException::withMessages([$field => "Choose an available product {$field}."]);
            }

            if (!$options && $value) {
                throw ValidationException::withMessages([$field => "This product does not have selectable {$field} options."]);
            }
        }
    }

    private function cartKey(int $productId, ?string $size, ?string $color): string
    {
        return hash('sha256', json_encode([$productId, $size, $color], JSON_THROW_ON_ERROR));
    }

    private function cartItems(): array
    {
        $cart = session()->get('product_cart', []);

        if (!$cart) {
            return [];
        }

        $products = Product::query()
            ->whereIn('id', collect($cart)->pluck('product_id')->unique())
            ->get()
            ->keyBy('id');
        $items = [];

        foreach ($cart as $key => $entry) {
            $product = $products->get($entry['product_id']);

            if (!$product || $product->stock_quantity < 1) {
                unset($cart[$key]);
                continue;
            }

            $quantity = min(max(1, (int) $entry['quantity']), $product->stock_quantity);
            $cart[$key]['quantity'] = $quantity;
            $unitPrice = $product->effective_price;

            $items[] = [
                'key' => $key,
                'product_id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'image_url' => $product->image_url,
                'size' => $entry['size'] ?? null,
                'color' => $entry['color'] ?? null,
                'quantity' => $quantity,
                'stock_quantity' => $product->stock_quantity,
                'unit_price' => $unitPrice,
                'subtotal' => round($unitPrice * $quantity, 2),
            ];
        }

        session()->put('product_cart', $cart);

        return $items;
    }
}