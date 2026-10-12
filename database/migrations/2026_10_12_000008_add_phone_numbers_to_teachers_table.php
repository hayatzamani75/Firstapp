<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->string('phone_number_1', 14)->nullable()->after('email');
            $table->string('phone_number_2', 14)->nullable()->after('phone_number_1');
        });
    }

    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn(['phone_number_1', 'phone_number_2']);
        });
    }
};