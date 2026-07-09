<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $page->meta_title ?: $page->title }}</title>
    @if($page->meta_description)
        <meta name="description" content="{{ $page->meta_description }}">
    @endif
    <style>
        :root { color-scheme: light; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; color: #0f172a; background: #fff; }
        .site-header, .site-footer { padding: 16px 24px; display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
        .site-header { border-bottom: 1px solid #e2e8f0; justify-content: space-between; }
        .site-header nav, .site-footer nav { display: flex; gap: 14px; flex-wrap: wrap; }
        .site-header a, .site-footer a { color: #0f172a; text-decoration: none; font-weight: 500; }
        .site-footer { border-top: 1px solid #e2e8f0; margin-top: 48px; color: #64748b; font-size: 14px; }
        .brand { font-weight: 700; letter-spacing: -0.02em; }
        {!! $renderCss !!}
    </style>
    {!! $page->custom_head !!}
</head>
<body>
@if(!empty($isPreview) && $page->has_unpublished_changes)
    <div style="position:sticky;top:0;z-index:50;padding:8px 16px;background:#eef8ff;color:#0c4a6e;border-bottom:1px solid #bae6fd;font:500 13px/1.4 system-ui,sans-serif;text-align:center">
        Draft preview — Live site still shows the last published version until you click <strong>Publish</strong>.
    </div>
@elseif(!empty($isPreview) && ! $page->isLive())
    <div style="position:sticky;top:0;z-index:50;padding:8px 16px;background:#eef8ff;color:#0c4a6e;border-bottom:1px solid #bae6fd;font:500 13px/1.4 system-ui,sans-serif;text-align:center">
        Draft preview — this page is not on the live site yet. Click <strong>Publish</strong> to make it public.
    </div>
@endif
<header class="site-header">
    <div class="brand">PageBuilder V2</div>
    <nav>
        @foreach($header as $item)
            <a href="{{ $item->url }}">{{ $item->label }}</a>
        @endforeach
    </nav>
</header>

<main>
    {!! $renderHtml !!}
</main>

<footer class="site-footer">
    <nav>
        @foreach($footer as $item)
            <a href="{{ $item->url }}">{{ $item->label }}</a>
        @endforeach
    </nav>
</footer>

{!! $page->custom_body_scripts !!}
</body>
</html>
