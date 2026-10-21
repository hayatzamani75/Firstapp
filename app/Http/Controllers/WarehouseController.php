<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    private const LOW_STOCK_THRESHOLD = 5;

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'stock' => ['sometimes', 'nullable', Rule::in(['low', 'out'])],
        ]);

        $filters = array_merge(['search' => '', 'stock' => ''], $filters);
        $query = Product::query()->latest();

        if ($filters['search'] !== '') {
            $search = $filters['search'];
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($filters['stock'] === 'low') {
            $query->whereBetween('stock_quantity', [1, self::LOW_STOCK_THRESHOLD]);
        } elseif ($filters['stock'] === 'out') {
            $query->where('stock_quantity', 0);
        }

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Warehouse/Index', [
            'products' => $products,
            'filters' => $filters,
            'stats' => [
                'products' => Product::query()->count(),
                'units' => (int) Product::query()->sum('stock_quantity'),
                'low_stock' => Product::query()->whereBetween('stock_quantity', [1, self::LOW_STOCK_THRESHOLD])->count(),
                'out_of_stock' => Product::query()->where('stock_quantity', 0)->count(),
            ],
            'movements' => StockMovement::query()
                ->with(['product:id,name,category', 'user:id,name'])
                ->latest()
                ->limit(8)
                ->get(),
            'lowStockThreshold' => self::LOW_STOCK_THRESHOLD,
        ]);
    }

    public function storeMovement(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'type' => ['required', Rule::in(['in', 'out'])],
            'quantity' => ['required', 'integer', 'min:1', 'max:1000000'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($request, $data) {
            $product = Product::query()->lockForUpdate()->findOrFail($data['product_id']);
            $before = $product->stock_quantity;
            $after = $data['type'] === 'in'
                ? $before + $data['quantity']
                : $before - $data['quantity'];

            if ($after < 0) {
                throw ValidationException::withMessages([
                    'quantity' => "Only {$before} units are currently in stock.",
                ]);
            }

            if ($after > 4_294_967_295) {
                throw ValidationException::withMessages([
                    'quantity' => 'The resulting stock level exceeds the supported limit.',
                ]);
            }

            $product->update(['stock_quantity' => $after]);

            StockMovement::query()->create([
                'product_id' => $product->id,
                'user_id' => $request->user()->id,
                'type' => $data['type'],
                'quantity' => $data['quantity'],
                'stock_before' => $before,
                'stock_after' => $after,
                'reason' => $data['reason'] ?? null,
            ]);
        });

        return to_route('warehouse.view')->with('success', 'Warehouse stock updated successfully.');
    }
}
