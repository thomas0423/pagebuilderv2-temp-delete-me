<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'status',
        'has_unpublished_changes',
        'project_json',
        'compiled_html',
        'compiled_css',
        'published_html',
        'published_css',
        'published_project_json',
        'custom_head',
        'custom_body_scripts',
        'meta_title',
        'meta_description',
        'published_at',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'project_json' => 'array',
            'published_project_json' => 'array',
            'has_unpublished_changes' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /** Whether this page has a live public version. */
    public function isLive(): bool
    {
        return filled($this->published_html) || $this->status === 'published';
    }

    public function liveHtml(): ?string
    {
        return $this->published_html ?: ($this->status === 'published' ? $this->compiled_html : null);
    }

    public function liveCss(): ?string
    {
        return $this->published_css ?: ($this->status === 'published' ? $this->compiled_css : null);
    }
}
