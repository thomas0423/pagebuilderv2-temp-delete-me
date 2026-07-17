<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_modules', function (Blueprint $table) {
            $table->id();
            $table->string('type', 32); // promotion | announcement | news | article
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->longText('body')->nullable();
            $table->string('image_url')->nullable();
            $table->string('banner_url')->nullable();
            $table->string('external_url')->nullable();
            $table->string('status', 32)->default('draft'); // draft | published | archived
            $table->date('published_on')->nullable();
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('source_table')->nullable();
            $table->string('source_id')->nullable();
            $table->string('source_channel')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['type', 'status']);
            $table->unique(['source_table', 'source_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_modules');
    }
};
