<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function __construct(private SettingsService $settings) {}

    public function index()
    {
        return $this->settings->allForAdmin();
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'storage_driver' => ['nullable', 'in:local,s3'],
            'storage_key' => ['nullable', 'string'],
            'storage_secret' => ['nullable', 'string'],
            'storage_bucket' => ['nullable', 'string'],
            'storage_region' => ['nullable', 'string'],
            'storage_endpoint' => ['nullable', 'string'],
            'db_driver' => ['nullable', 'in:sqlite,mysql,pgsql'],
            'db_host' => ['nullable', 'string'],
            'db_port' => ['nullable', 'string'],
            'db_database' => ['nullable', 'string'],
            'db_username' => ['nullable', 'string'],
            'db_password' => ['nullable', 'string'],
            'ai_provider' => ['nullable', 'in:openai,anthropic,gemini'],
            'ai_api_key' => ['nullable', 'string'],
            'ai_model' => ['nullable', 'string'],
        ]);

        return $this->settings->update($data);
    }
}
