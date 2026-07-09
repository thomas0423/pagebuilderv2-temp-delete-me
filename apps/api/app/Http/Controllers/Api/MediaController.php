<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index()
    {
        return Media::query()->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240'],
            'alt' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('file');
        $driver = Setting::getValue('storage_driver', 'local');
        $disk = $driver === 'local' ? 'public' : 's3';

        // Fall back to local if cloud is selected but not configured
        if ($disk === 's3' && ! filled(Setting::getValue('storage_key'))) {
            $disk = 'public';
        }

        $path = $file->store('media/'.now()->format('Y/m'), $disk);
        $url = $disk === 'public'
            ? Storage::disk('public')->url($path)
            : Storage::disk($disk)->url($path);

        $media = Media::query()->create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'disk' => $disk,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize() ?? 0,
            'alt' => $request->input('alt', Str::headline(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))),
            'url' => $url,
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json($media, 201);
    }

    public function destroy(Media $medium)
    {
        try {
            Storage::disk($medium->disk)->delete($medium->path);
        } catch (\Throwable) {
            // ignore missing files
        }

        $medium->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
