<?php

namespace App\Services;

use App\Models\Setting;

class SettingsService
{
    public function allForAdmin(): array
    {
        $keys = [
            'site_name' => ['group' => 'general', 'secret' => false, 'default' => 'PageBuilder V2'],
            'storage_driver' => ['group' => 'storage', 'secret' => false, 'default' => 'local'],
            'storage_key' => ['group' => 'storage', 'secret' => true, 'default' => null],
            'storage_secret' => ['group' => 'storage', 'secret' => true, 'default' => null],
            'storage_bucket' => ['group' => 'storage', 'secret' => false, 'default' => null],
            'storage_region' => ['group' => 'storage', 'secret' => false, 'default' => null],
            'storage_endpoint' => ['group' => 'storage', 'secret' => false, 'default' => null],
            'db_driver' => ['group' => 'database', 'secret' => false, 'default' => 'mysql'],
            'db_host' => ['group' => 'database', 'secret' => false, 'default' => '127.0.0.1'],
            'db_port' => ['group' => 'database', 'secret' => false, 'default' => '3306'],
            'db_database' => ['group' => 'database', 'secret' => false, 'default' => 'pagebuilderv2'],
            'db_username' => ['group' => 'database', 'secret' => false, 'default' => 'root'],
            'db_password' => ['group' => 'database', 'secret' => true, 'default' => null],
            'ai_provider' => ['group' => 'ai', 'secret' => false, 'default' => 'openai'],
            'ai_api_key' => ['group' => 'ai', 'secret' => true, 'default' => null],
            'ai_model' => ['group' => 'ai', 'secret' => false, 'default' => 'gpt-4o-mini'],
        ];

        $out = [];

        foreach ($keys as $key => $meta) {
            $raw = Setting::query()->where('key', $key)->first();
            $hasValue = $raw && $raw->value !== null && $raw->value !== '';

            $out[$key] = [
                'group' => $meta['group'],
                'is_secret' => $meta['secret'],
                'configured' => $hasValue,
                'value' => $meta['secret']
                    ? ($hasValue ? '••••••••' : null)
                    : ($hasValue ? Setting::getValue($key, $meta['default']) : $meta['default']),
            ];
        }

        $out['runtime'] = [
            'active_db' => config('database.default'),
            'active_filesystem' => config('filesystems.default'),
            'ai_ready' => filled(Setting::getValue('ai_api_key')),
        ];

        return $out;
    }

    public function update(array $payload): array
    {
        $secretKeys = [
            'storage_key',
            'storage_secret',
            'db_password',
            'ai_api_key',
        ];

        $groups = [
            'site_name' => 'general',
            'storage_driver' => 'storage',
            'storage_key' => 'storage',
            'storage_secret' => 'storage',
            'storage_bucket' => 'storage',
            'storage_region' => 'storage',
            'storage_endpoint' => 'storage',
            'db_driver' => 'database',
            'db_host' => 'database',
            'db_port' => 'database',
            'db_database' => 'database',
            'db_username' => 'database',
            'db_password' => 'database',
            'ai_provider' => 'ai',
            'ai_api_key' => 'ai',
            'ai_model' => 'ai',
        ];

        foreach ($payload as $key => $value) {
            if (! array_key_exists($key, $groups)) {
                continue;
            }

            // Keep existing secret when UI sends masked placeholder / empty intentionally skipped
            if (in_array($key, $secretKeys, true)) {
                if ($value === null || $value === '' || $value === '••••••••') {
                    continue;
                }
            }

            Setting::setValue($key, $value, $groups[$key], in_array($key, $secretKeys, true));
        }

        return $this->allForAdmin();
    }

    public function aiApiKey(): ?string
    {
        $key = Setting::getValue('ai_api_key');

        return filled($key) ? (string) $key : null;
    }
}
