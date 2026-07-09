<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AiService;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function __construct(private AiService $ai) {}

    public function generate(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'in:content,section,page,image'],
            'prompt' => ['required', 'string', 'max:4000'],
            'context' => ['nullable', 'string'],
        ]);

        try {
            $result = $this->ai->generate($data['type'], $data['prompt'], $data['context'] ?? null);
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'hint' => 'Open Settings → AI and paste your API key, then try again.',
                'settings_path' => '/settings',
            ], $e->getStatusCode());
        }

        return response()->json($result);
    }
}
