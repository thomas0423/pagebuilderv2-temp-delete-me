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
            'context' => ['nullable', 'string', 'max:20000'],
            'selected_html' => ['nullable', 'string', 'max:50000'],
            'selected_text' => ['nullable', 'string', 'max:8000'],
        ]);

        if (function_exists('set_time_limit')) {
            @set_time_limit(180);
        }

        try {
            $result = $this->ai->generate(
                $data['type'],
                $data['prompt'],
                $data['context'] ?? null,
                $data['selected_html'] ?? null,
                $data['selected_text'] ?? null,
            );
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            $message = $e->getMessage();
            $needsKey = str_contains(strtolower($message), 'api key')
                || str_contains(strtolower($message), 'not configured');

            return response()->json([
                'message' => $message,
                'hint' => $needsKey
                    ? 'Open Settings → AI, choose a provider, paste that provider’s API key, then try again.'
                    : 'Try selecting a section on the canvas, keep the prompt short, and generate again.',
                'settings_path' => '/settings',
            ], $e->getStatusCode() ?: 422);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'AI request failed: '.$e->getMessage(),
                'hint' => 'The API may have timed out. Restart `npm run dev` and try a shorter prompt.',
                'settings_path' => '/settings',
            ], 422);
        }

        return response()->json($result);
    }
}
