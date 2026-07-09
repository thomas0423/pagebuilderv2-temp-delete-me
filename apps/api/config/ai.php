<?php

/**
 * AI providers available in Settings → AI.
 * Keys are stored in the settings table (ai_provider, ai_api_key, ai_model).
 */
return [
    'providers' => [
        'openai' => [
            'label' => 'ChatGPT (OpenAI)',
            'driver' => 'openai',
            'base_url' => 'https://api.openai.com/v1',
            'models' => [
                'gpt-4o-mini' => 'GPT-4o mini',
                'gpt-4o' => 'GPT-4o',
                'gpt-4.1' => 'GPT-4.1',
                'gpt-4.1-mini' => 'GPT-4.1 mini',
                'o4-mini' => 'o4-mini',
            ],
            'default_model' => 'gpt-4o-mini',
            'docs' => 'https://platform.openai.com/api-keys',
            'hint' => 'Use an OpenAI API key from platform.openai.com.',
        ],
        'anthropic' => [
            'label' => 'Claude (Anthropic)',
            'driver' => 'anthropic',
            'base_url' => 'https://api.anthropic.com',
            'models' => [
                'claude-sonnet-4-20250514' => 'Claude Sonnet 4',
                'claude-3-5-haiku-latest' => 'Claude 3.5 Haiku',
                'claude-3-7-sonnet-latest' => 'Claude 3.7 Sonnet',
                'claude-opus-4-20250514' => 'Claude Opus 4',
            ],
            'default_model' => 'claude-sonnet-4-20250514',
            'docs' => 'https://console.anthropic.com/settings/keys',
            'hint' => 'Anthropic API key for Claude models (same family as Claude Code).',
        ],
        'gemini' => [
            'label' => 'Gemini (Google)',
            'driver' => 'gemini',
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
            'models' => [
                'gemini-2.0-flash' => 'Gemini 2.0 Flash',
                'gemini-2.5-flash' => 'Gemini 2.5 Flash',
                'gemini-2.5-pro' => 'Gemini 2.5 Pro',
                'gemini-1.5-flash' => 'Gemini 1.5 Flash',
            ],
            'default_model' => 'gemini-2.0-flash',
            'docs' => 'https://aistudio.google.com/apikey',
            'hint' => 'Google AI Studio API key.',
        ],
        'minimax' => [
            'label' => 'MiniMax',
            'driver' => 'openai',
            'base_url' => 'https://api.minimax.io/v1',
            'models' => [
                'MiniMax-M3' => 'MiniMax-M3',
                'MiniMax-Text-01' => 'MiniMax Text-01',
                'MiniMax-M1' => 'MiniMax-M1',
                'abab6.5s-chat' => 'abab6.5s-chat',
            ],
            'default_model' => 'MiniMax-M3',
            'docs' => 'https://platform.minimax.io/',
            'hint' => 'MiniMax platform API key (OpenAI-compatible chat).',
        ],
        'groq' => [
            'label' => 'Groq',
            'driver' => 'openai',
            'base_url' => 'https://api.groq.com/openai/v1',
            'models' => [
                'llama-3.3-70b-versatile' => 'Llama 3.3 70B',
                'llama-3.1-8b-instant' => 'Llama 3.1 8B Instant',
                'mixtral-8x7b-32768' => 'Mixtral 8x7B',
                'gemma2-9b-it' => 'Gemma 2 9B',
            ],
            'default_model' => 'llama-3.3-70b-versatile',
            'docs' => 'https://console.groq.com/keys',
            'hint' => 'Fast inference via GroqCloud.',
        ],
        'deepseek' => [
            'label' => 'DeepSeek',
            'driver' => 'openai',
            'base_url' => 'https://api.deepseek.com/v1',
            'models' => [
                'deepseek-chat' => 'DeepSeek Chat',
                'deepseek-reasoner' => 'DeepSeek Reasoner',
            ],
            'default_model' => 'deepseek-chat',
            'docs' => 'https://platform.deepseek.com/api_keys',
            'hint' => 'DeepSeek OpenAI-compatible API.',
        ],
        'mistral' => [
            'label' => 'Mistral',
            'driver' => 'openai',
            'base_url' => 'https://api.mistral.ai/v1',
            'models' => [
                'mistral-small-latest' => 'Mistral Small',
                'mistral-medium-latest' => 'Mistral Medium',
                'mistral-large-latest' => 'Mistral Large',
                'open-mistral-nemo' => 'Mistral Nemo',
            ],
            'default_model' => 'mistral-small-latest',
            'docs' => 'https://console.mistral.ai/api-keys',
            'hint' => 'Mistral AI platform key.',
        ],
        'xai' => [
            'label' => 'Grok (xAI)',
            'driver' => 'openai',
            'base_url' => 'https://api.x.ai/v1',
            'models' => [
                'grok-3-mini' => 'Grok 3 Mini',
                'grok-3' => 'Grok 3',
                'grok-2-latest' => 'Grok 2',
            ],
            'default_model' => 'grok-3-mini',
            'docs' => 'https://console.x.ai/',
            'hint' => 'xAI API key for Grok models.',
        ],
        'openrouter' => [
            'label' => 'OpenRouter',
            'driver' => 'openai',
            'base_url' => 'https://openrouter.ai/api/v1',
            'models' => [
                'openai/gpt-4o-mini' => 'GPT-4o mini',
                'anthropic/claude-sonnet-4' => 'Claude Sonnet 4',
                'google/gemini-2.0-flash-001' => 'Gemini 2.0 Flash',
                'deepseek/deepseek-chat' => 'DeepSeek Chat',
                'meta-llama/llama-3.3-70b-instruct' => 'Llama 3.3 70B',
            ],
            'default_model' => 'openai/gpt-4o-mini',
            'docs' => 'https://openrouter.ai/keys',
            'hint' => 'One key for many models via OpenRouter.',
        ],
    ],
];
