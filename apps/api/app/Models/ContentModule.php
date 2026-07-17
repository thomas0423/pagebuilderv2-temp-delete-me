<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ContentModule extends Model
{
    public const TYPES = ['promotion', 'announcement', 'news', 'article'];

    public const STATUSES = ['draft', 'published', 'archived'];

    protected $fillable = [
        'type',
        'title',
        'slug',
        'summary',
        'body',
        'image_url',
        'banner_url',
        'external_url',
        'status',
        'published_on',
        'starts_at',
        'ends_at',
        'is_pinned',
        'sort_order',
        'source_table',
        'source_id',
        'source_channel',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'published_on' => 'date',
            'starts_at' => 'date',
            'ends_at' => 'date',
            'is_pinned' => 'boolean',
            'sort_order' => 'integer',
            'meta' => 'array',
        ];
    }

    public function scopeOfType(Builder $query, ?string $type): Builder
    {
        if ($type && in_array($type, self::TYPES, true)) {
            $query->where('type', $type);
        }

        return $query;
    }
}
