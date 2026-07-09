<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::query()->orderBy('location')->orderBy('sort_order');

        if ($request->filled('location')) {
            $query->where('location', $request->string('location'));
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'location' => ['required', 'in:header,footer'],
            'label' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        return response()->json(Menu::query()->create($data), 201);
    }

    public function update(Request $request, Menu $menu)
    {
        $data = $request->validate([
            'location' => ['sometimes', 'in:header,footer'],
            'label' => ['sometimes', 'string', 'max:255'],
            'url' => ['sometimes', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $menu->update($data);

        return $menu->fresh();
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
