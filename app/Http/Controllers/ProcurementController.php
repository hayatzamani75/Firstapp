<?php

namespace App\Http\Controllers;

use App\Models\Procurement;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProcurementController extends Controller
{
    private const STATUSES = ['draft', 'ordered', 'cancelled'];

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'nullable', Rule::in(['draft', 'ordered', 'received', 'cancelled'])],
        ]);
        $filters = array_merge(['search' => '', 'status' => ''], $filters);

        $query = Procurement::query()->with(['product:id,name,category,image_path', 'user:id,name'])->latest();

        if ($filters['search'] !== '') {
            $search = $filters['search'];
            $query->where(function ($builder) use ($search) {
                $builder->where('reference', 'like', "%{$search}%")
                    ->orWhere('supplier', 'like', "%{$search}%")
                    ->orWhereHas('product', fn ($product) => $product->where('name', 'like', "%{$search}%"));
            });
        }

        if ($filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        return Inertia::render('Procurement/Index', [
            'procurements' => $query->paginate(12)->withQueryString(),
            'products' => Product::query()->orderBy('name')->get(['id', 'name', 'sku', 'stock_quantity']),
            'filters' => $filters,
            'stats' => [
                'total' => Procurement::query()->count(),
                'pending' => Procurement::query()->whereIn('status', ['draft', 'ordered'])->count(),
                'received' => Procurement::query()->where('status', 'received')->count(),
                'spend' => (float) Procurement::query()->where('status', 'received')->selectRaw('COALESCE(SUM(quantity * unit_cost), 0) as total')->value('total'),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);
        $data['reference'] = $this->newReference();
        $data['user_id'] = $request->user()->id;

        Procurement::query()->create($data);

        return to_route('procurement.view')->with('success', 'Purchase order created successfully.');
    }

    public function update(Request $request, Procurement $procurement): RedirectResponse
    {
        abort_if($procurement->status === 'received', 403, 'Received purchase orders are locked.');

        $data = $this->validatedData($request);
        $procurement->update($data);

        return to_route('procurement.view')->with('success', 'Purchase order updated successfully.');
    }

    public function destroy(Procurement $procurement): RedirectResponse
    {
        abort_if($procurement->status === 'received', 403, 'Received purchase orders cannot be deleted.');
        $procurement->delete();

        return to_route('procurement.view')->with('success', 'Purchase order deleted successfully.');
    }

    public function receive(Procurement $procurement): RedirectResponse
    {
        DB::transaction(function () use ($procurement) {
            $lockedOrder = Procurement::query()->lockForUpdate()->findOrFail($procurement->id);
            if ($lockedOrder->status !== 'ordered') {
                throw ValidationException::withMessages([
                    'status' => 'Only ordered purchase orders can be received.',
                ]);
            }

            if (!$lockedOrder->product_id) {
                throw ValidationException::withMessages([
                    'product_id' => 'The product for this purchase order no longer exists.',
                ]);
            }

            $product = Product::query()->lockForUpdate()->findOrFail($lockedOrder->product_id);
            $before = $product->stock_quantity;
            $after = $before + $lockedOrder->quantity;

            if ($after > 4_294_967_295) {
                throw ValidationException::withMessages([
                    'quantity' => 'Receiving this order exceeds the supported stock limit.',
                ]);
            }

            $product->update(['stock_quantity' => $after]);
            StockMovement::query()->create([
                'product_id' => $product->id,
                'user_id' => auth()->id(),
                'type' => 'in',
                'quantity' => $lockedOrder->quantity,
                'stock_before' => $before,
                'stock_after' => $after,
                'reason' => 'Procurement '.$lockedOrder->reference,
            ]);

            $lockedOrder->update([
                'status' => 'received',
                'received_at' => now(),
            ]);
        });

        return to_route('procurement.view')->with('success', 'Purchase order received and inventory updated.');
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'supplier' => ['required', 'string', 'max:255'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:1000000'],
            'unit_cost' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'status' => ['required', Rule::in(self::STATUSES)],
            'expected_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    private function newReference(): string
    {
        do {
            $reference = 'PO-'.now()->format('Ymd').'-'.Str::upper(Str::random(5));
        } while (Procurement::query()->where('reference', $reference)->exists());

        return $reference;
    }
}
