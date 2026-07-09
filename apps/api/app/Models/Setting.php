<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Setting extends Model
{
    protected $fillable = [
        'group',
        'key',
        'value',
        'is_secret',
    ];

    protected function casts(): array
    {
        return [
            'is_secret' => 'boolean',
        ];
    }

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $setting = static::query()->where('key', $key)->first();

        if (! $setting || $setting->value === null || $setting->value === '') {
            return $default;
        }

        if ($setting->is_secret) {
            try {
                return Crypt::decryptString($setting->value);
            } catch (\Throwable) {
                return $default;
            }
        }

        return $setting->value;
    }

    public static function setValue(string $key, mixed $value, string $group = 'general', bool $isSecret = false): self
    {
        $stored = $value;

        if ($isSecret && $value !== null && $value !== '') {
            $stored = Crypt::encryptString((string) $value);
        }

        return static::query()->updateOrCreate(
            ['key' => $key],
            [
                'group' => $group,
                'value' => $stored,
                'is_secret' => $isSecret,
            ]
        );
    }
}
