<?php

namespace App\Support;

use Illuminate\Support\Facades\File;

class ThemeAssets
{
    /**
     * @return array{css: list<string>, js: list<string>, base: string}
     */
    public static function manifest(): array
    {
        return [
            'base' => (string) config('theme.public_base', '/themes/demo'),
            'css' => self::urls('css', (array) config('theme.css_priority', [])),
            'js' => self::urls('js', (array) config('theme.js_priority', []), (array) config('theme.js_exclude', [])),
        ];
    }

    /**
     * Absolute public URLs for theme stylesheets (for Blade + editor canvas).
     *
     * @return list<string>
     */
    public static function cssUrls(): array
    {
        return self::manifest()['css'];
    }

    /**
     * Absolute public URLs for theme scripts.
     *
     * @return list<string>
     */
    public static function jsUrls(): array
    {
        return self::manifest()['js'];
    }

    /**
     * @param  list<string>  $priority
     * @param  list<string>  $exclude
     * @return list<string>
     */
    private static function urls(string $folder, array $priority = [], array $exclude = []): array
    {
        $root = (string) config('theme.demo_path', public_path('themes/demo'));
        $dir = $root.DIRECTORY_SEPARATOR.$folder;
        $base = rtrim((string) config('theme.public_base', '/themes/demo'), '/');

        if (! File::isDirectory($dir)) {
            return [];
        }

        $ext = $folder === 'css' ? 'css' : 'js';
        $files = collect(File::files($dir))
            ->filter(fn ($file) => strtolower($file->getExtension()) === $ext)
            ->map(fn ($file) => $file->getFilename())
            ->reject(fn (string $name) => in_array($name, $exclude, true))
            ->values()
            ->all();

        $ordered = [];
        foreach ($priority as $name) {
            if (in_array($name, $files, true)) {
                $ordered[] = $name;
            }
        }

        $rest = collect($files)
            ->reject(fn (string $name) => in_array($name, $ordered, true))
            ->sort()
            ->values()
            ->all();

        return collect([...$ordered, ...$rest])
            ->map(fn (string $name) => $base.'/'.$folder.'/'.$name)
            ->values()
            ->all();
    }
}
