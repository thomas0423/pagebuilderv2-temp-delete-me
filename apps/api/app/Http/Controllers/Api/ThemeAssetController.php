<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ThemeAssets;

class ThemeAssetController extends Controller
{
    /**
     * Public manifest of Affin demo theme CSS/JS for the studio canvas.
     */
    public function __invoke()
    {
        return response()->json(ThemeAssets::manifest());
    }
}
