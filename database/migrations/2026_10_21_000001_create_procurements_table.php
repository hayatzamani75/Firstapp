<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procurements', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('supplier');
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('quantity');
            $table->decimal('unit_cost', 10, 2);
            $table->string('status', 20)->default('draft')->index();
            $table->date('expected_date')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['supplier', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procurements');
    }
};
