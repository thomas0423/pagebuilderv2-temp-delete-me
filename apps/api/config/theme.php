<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AffinCMS demo theme assets
    |--------------------------------------------------------------------------
    |
    | Files live under public/themes/demo/{css,js} (copied from themes.zip
    | themes/demo/public). Served at /themes/demo/...
    |
    */

    'demo_path' => public_path('themes/demo'),

    'public_base' => '/themes/demo',

    /*
    | Load order hints — these files are prepended when present.
    | Remaining assets are appended alphabetically.
    */
    'css_priority' => [
        'style.css',
    ],

    'js_priority' => [
        'widgets.min.js',
        'custom.js',
        'chat-widget-pre.js',
        'chat-widget-post.js',
    ],

    /*
    | Skip noisy / duplicate bundles on the public site.
    */
    'js_exclude' => [
        'widgets.js',      // prefer widgets.min.js
        'widgets-bak.js',
    ],

];
