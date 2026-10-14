<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_page_requires_authentication(): void
    {
        $this->get('/product')->assertRedirect('/login');
    }

    public function test_authenticated_user_sees_saved_products_and_categories(): void
    {
        $user = User::factory()->create();
        $product = $this->createProduct($user, ['category' => 'Boots']);

        $this->actingAs($user)
            ->get('/product')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Product')
                ->where('products.data.0.id', $product->id)
                ->where('categories.0', 'Boots')
                ->where('cartCount', 0));
    }

    public function test_product_image_and_fields_are_persisted_from_multipart_request(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('product.store'), [
            'image' => UploadedFile::fake()->image('jacket.png'),
            'name' => 'Canvas Jacket',
            'category' => "Men's Clothing",
            'description' => 'Lightweight canvas jacket.',
            'price' => '89.90',
            'discount_price' => '69.90',
            'brand' => 'North Trail',
            'sizes' => ['M', 'L'],
            'colors' => ['Olive', 'Black'],
            'stock_quantity' => 5,
            'sku' => 'JACKET-001',
        ])->assertRedirect(route('product.view'));

        $product = Product::firstOrFail();
        Storage::disk('public')->assertExists($product->image_path);
        $this->assertDatabaseHas('products', [
            'created_by' => $user->id,
            'name' => 'Canvas Jacket',
            'category' => "Men's Clothing",
            'price' => '89.90',
            'discount_price' => '69.90',
            'sku' => 'JACKET-001',
        ]);
        $this->assertSame(['M', 'L'], $product->sizes);
        $this->assertSame(['Olive', 'Black'], $product->colors);
    }

    public function test_invalid_product_image_is_rejected(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $this->actingAs($user)->from('/product')->post(route('product.store'), [
            'image' => UploadedFile::fake()->create('not-an-image.txt', 20, 'text/plain'),
            'name' => 'Invalid product',
            'category' => 'Shoes',
            'price' => 20,
            'stock_quantity' => 1,
        ])->assertRedirect('/product')->assertSessionHasErrors('image');

        $this->assertDatabaseCount('products', 0);
        $this->assertSame([], Storage::disk('public')->allFiles('products'));
    }

    public function test_cart_keeps_different_products_and_variants_as_separate_items(): void
    {
        $user = User::factory()->create();
        $first = $this->createProduct($user, [
            'name' => 'Runner',
            'sizes' => ['8', '9'],
            'colors' => ['Black'],
            'stock_quantity' => 5,
            'price' => 45,
            'discount_price' => 35,
        ]);
        $second = $this->createProduct($user, [
            'name' => 'Leather Boot',
            'category' => 'Boots',
            'sizes' => ['9'],
            'colors' => ['Brown'],
            'stock_quantity' => 3,
            'price' => 120,
        ]);

        $this->actingAs($user)->post(route('product.cart.add'), [
            'product_id' => $first->id,
            'quantity' => 1,
            'size' => '8',
            'color' => 'Black',
        ])->assertRedirect();
        $this->post(route('product.cart.add'), [
            'product_id' => $first->id,
            'quantity' => 1,
            'size' => '8',
            'color' => 'Black',
        ])->assertRedirect();
        $this->post(route('product.cart.add'), [
            'product_id' => $first->id,
            'quantity' => 2,
            'size' => '9',
            'color' => 'Black',
        ])->assertRedirect();
        $this->post(route('product.cart.add'), [
            'product_id' => $second->id,
            'quantity' => 1,
            'size' => '9',
            'color' => 'Brown',
        ])->assertRedirect();

        $this->get('/product')->assertInertia(fn (Assert $page) => $page
            ->where('cartCount', 5)
            ->where('cartTotal', 260)
            ->has('cartItems', 3)
            ->where('cartItems.0.product_id', $first->id)
            ->where('cartItems.0.quantity', 2)
            ->where('cartItems.0.unit_price', 35));
    }

    public function test_cart_rejects_quantities_above_database_stock(): void
    {
        $user = User::factory()->create();
        $product = $this->createProduct($user, ['stock_quantity' => 2]);

        $this->actingAs($user)
            ->from('/product')
            ->post(route('product.cart.add'), [
                'product_id' => $product->id,
                'quantity' => 3,
            ])
            ->assertRedirect('/product')
            ->assertSessionHasErrors('cart');

        $this->assertSame([], session('product_cart', []));
    }

    private function createProduct(User $user, array $attributes = []): Product
    {
        return Product::create(array_merge([
            'created_by' => $user->id,
            'name' => 'Everyday Shoe',
            'category' => 'Shoes',
            'description' => 'A comfortable everyday shoe.',
            'price' => '50.00',
            'discount_price' => null,
            'brand' => 'KIC',
            'sizes' => null,
            'colors' => null,
            'stock_quantity' => 10,
            'sku' => null,
            'image_path' => 'products/test.jpg',
        ], $attributes));
    }
}