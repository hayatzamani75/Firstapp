<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::query()->with(['items', 'user'])->latest();

        return Inertia::render('Orders/Index', [
            'orders' => $query->paginate(12)->withQueryString(),
        ]);
    }

    public function checkout(Request $request): RedirectResponse
    {
        $cart = $request->session()->get('product_cart', []);

        if (!$cart) {
            throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
        }

        $order = DB::transaction(function () use ($request, $cart): Order {
            $products = [];
            $totalCents = 0;

            foreach ($cart as $item) {
                $quantity = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT);
                if (!$quantity || $quantity < 1) {
                    throw ValidationException::withMessages(['cart' => 'A cart quantity is invalid.']);
                }

                $product = Product::query()->lockForUpdate()->find($item['product_id'] ?? null);
                if (!$product || $product->stock_quantity < $quantity) {
                    throw ValidationException::withMessages(['cart' => 'A product no longer has enough stock. Refresh your cart and try again.']);
                }

                $this->validateOptions($product, $item);
                $unitCents = (int) round($product->effective_price * 100);
                $products[] = [$product, $item, $quantity, $unitCents];
                $totalCents += $unitCents * $quantity;
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => Order::STATUS_PENDING,
                'total' => $this->formatCents($totalCents),
            ]);

            foreach ($products as [$product, $item, $quantity, $unitCents]) {
                $product->decrement('stock_quantity', $quantity);
                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'category' => $product->category,
                    'sku' => $product->sku,
                    'size' => $item['size'] ?? null,
                    'color' => $item['color'] ?? null,
                    'unit_price' => $this->formatCents($unitCents),
                    'quantity' => $quantity,
                    'line_total' => $this->formatCents($unitCents * $quantity),
                ]);
            }

            return $order;
        });

        $request->session()->forget('product_cart');

        return to_route('product.view')->with('success', "Order #{$order->id} was placed. Payment is not configured for this store.");
    }

    public function cancel(Request $request, Order $order): RedirectResponse
    {
        DB::transaction(function () use ($order): void {
            $lockedOrder = Order::query()->lockForUpdate()->with('items')->findOrFail($order->id);

            if ($lockedOrder->status !== Order::STATUS_PENDING) {
                throw ValidationException::withMessages(['order' => 'Only pending orders can be cancelled.']);
            }

            foreach ($lockedOrder->items as $item) {
                if ($item->product_id) {
                    Product::query()->whereKey($item->product_id)->lockForUpdate()->increment('stock_quantity', $item->quantity);
                }
            }

            $lockedOrder->update(['status' => Order::STATUS_CANCELLED]);
        });

        return back()->with('success', "Order #{$order->id} was cancelled and its stock was restored.");
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', Rule::in([
                Order::STATUS_PROCESSING,
                Order::STATUS_SHIPPED,
                Order::STATUS_DELIVERED,
            ])],
        ]);

        $allowedNextStatuses = match ($order->status) {
            Order::STATUS_PENDING => [Order::STATUS_PROCESSING],
            Order::STATUS_PROCESSING => [Order::STATUS_SHIPPED],
            Order::STATUS_SHIPPED => [Order::STATUS_DELIVERED],
            default => [],
        };

        if (!in_array($data['status'], $allowedNextStatuses, true)) {
            throw ValidationException::withMessages(['status' => 'That order status transition is not allowed.']);
        }

        $order->update(['status' => $data['status']]);

        return back()->with('success', "Order #{$order->id} updated to {$data['status']}.");
    }

    private function validateOptions(Product $product, array $item): void
    {
        foreach (['size' => 'sizes', 'color' => 'colors'] as $field => $attribute) {
            $options = $product->{$attribute} ?? [];
            $value = $item[$field] ?? null;

            if ($options && (!$value || !in_array($value, $options, true))) {
                throw ValidationException::withMessages(['cart' => "A selected product {$field} is no longer available."]);
            }

            if (!$options && $value) {
                throw ValidationException::withMessages(['cart' => "A selected product {$field} is invalid."]);
            }
        }
    }

    private function formatCents(int $cents): string
    {
        return number_format($cents / 100, 2, '.', '');
    }
}
