<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->longText('published_html')->nullable()->after('compiled_css');
            $table->longText('published_css')->nullable()->after('published_html');
            $table->json('published_project_json')->nullable()->after('published_css');
            $table->boolean('has_unpublished_changes')->default(false)->after('status');
        });

        // Existing published pages: keep live content as the published snapshot
        DB::table('pages')
            ->where('status', 'published')
            ->orderBy('id')
            ->each(function ($page) {
                DB::table('pages')->where('id', $page->id)->update([
                    'published_html' => $page->compiled_html,
                    'published_css' => $page->compiled_css,
                    'published_project_json' => $page->project_json,
                    'has_unpublished_changes' => false,
                ]);
            });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'published_html',
                'published_css',
                'published_project_json',
                'has_unpublished_changes',
            ]);
        });
    }
};
