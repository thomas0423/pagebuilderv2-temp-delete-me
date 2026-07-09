<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Page;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@pagebuilder.test'],
            [
                'name' => 'Demo Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'editor@pagebuilder.test'],
            [
                'name' => 'Demo Editor',
                'password' => Hash::make('password'),
                'role' => 'editor',
            ]
        );

        Setting::setValue('site_name', 'PageBuilder V2', 'general');
        Setting::setValue('storage_driver', 'local', 'storage');
        Setting::setValue('db_driver', 'mysql', 'database');
        Setting::setValue('db_host', '127.0.0.1', 'database');
        Setting::setValue('db_port', '3306', 'database');
        Setting::setValue('db_database', 'pagebuilderv2', 'database');
        Setting::setValue('db_username', 'root', 'database');
        Setting::setValue('ai_provider', 'openai', 'ai');
        Setting::setValue('ai_model', 'gpt-4o-mini', 'ai');

        Product::query()->updateOrCreate(
            ['slug' => 'aurora-lamp'],
            [
                'name' => 'Aurora Lamp',
                'description' => 'Soft ambient light for modern desks.',
                'price' => 129.00,
                'image_url' => 'https://picsum.photos/seed/aurora/640/480',
                'is_active' => true,
            ]
        );

        Product::query()->updateOrCreate(
            ['slug' => 'nimbus-chair'],
            [
                'name' => 'Nimbus Chair',
                'description' => 'Ergonomic seating with quiet confidence.',
                'price' => 349.00,
                'image_url' => 'https://picsum.photos/seed/nimbus/640/480',
                'is_active' => true,
            ]
        );

        foreach ([
            ['location' => 'header', 'label' => 'Home', 'url' => '/', 'sort_order' => 1],
            ['location' => 'header', 'label' => 'Products', 'url' => '/p/home#products', 'sort_order' => 2],
            ['location' => 'header', 'label' => 'Contact', 'url' => '/p/home#contact', 'sort_order' => 3],
            ['location' => 'footer', 'label' => 'Privacy', 'url' => '#', 'sort_order' => 1],
            ['location' => 'footer', 'label' => 'Terms', 'url' => '#', 'sort_order' => 2],
        ] as $item) {
            Menu::query()->updateOrCreate(
                ['location' => $item['location'], 'label' => $item['label']],
                $item + ['is_active' => true]
            );
        }

        $html = <<<'HTML'
<section style="padding:72px 24px;background:linear-gradient(120deg,#0b1220,#1d2a44);color:#f8fafc;text-align:center">
  <p style="letter-spacing:.18em;text-transform:uppercase;font-size:12px;opacity:.7">PageBuilder V2</p>
  <h1 style="font-size:clamp(2.4rem,6vw,4rem);margin:12px 0;font-family:Georgia,serif">Design freely. Publish instantly.</h1>
  <p style="max-width:560px;margin:0 auto 28px;opacity:.85;line-height:1.6">Drag blocks, tune every style, drop custom code, or ask AI to draft a section for you.</p>
  <a href="#products" style="display:inline-block;padding:12px 22px;background:#f97316;color:#111;border-radius:999px;text-decoration:none;font-weight:700">Explore products</a>
</section>
<section id="products" style="padding:64px 24px;max-width:960px;margin:0 auto">
  <h2 style="font-family:Georgia,serif;font-size:2rem;margin-bottom:8px">Featured products</h2>
  <p style="color:#64748b;margin-bottom:28px">Managed from the Products module — no developer needed.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">
    <article style="border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;background:#fff">
      <img src="https://picsum.photos/seed/aurora/640/400" alt="Aurora Lamp" style="width:100%;display:block">
      <div style="padding:16px"><h3 style="margin:0 0 8px">Aurora Lamp</h3><p style="margin:0;color:#64748b">$129.00</p></div>
    </article>
    <article style="border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;background:#fff">
      <img src="https://picsum.photos/seed/nimbus/640/400" alt="Nimbus Chair" style="width:100%;display:block">
      <div style="padding:16px"><h3 style="margin:0 0 8px">Nimbus Chair</h3><p style="margin:0;color:#64748b">$349.00</p></div>
    </article>
  </div>
</section>
<section id="contact" style="padding:56px 24px;background:#fff7ed;text-align:center">
  <h2 style="font-family:Georgia,serif">Ready to present?</h2>
  <p style="color:#9a3412">Open the admin at localhost:5173 — login with admin@pagebuilder.test / password</p>
</section>
HTML;

        $css = 'img{max-width:100%;height:auto}';
        $project = [
            'pages' => [[
                'frames' => [[
                    'component' => [
                        'type' => 'wrapper',
                        'components' => [
                            ['type' => 'text', 'content' => $html],
                        ],
                    ],
                ]],
            ]],
        ];

        Page::query()->updateOrCreate(
            ['slug' => 'home'],
            [
                'title' => 'Home',
                'status' => 'published',
                'has_unpublished_changes' => false,
                'compiled_html' => $html,
                'compiled_css' => $css,
                'published_html' => $html,
                'published_css' => $css,
                'published_project_json' => $project,
                'project_json' => $project,
                'meta_title' => 'PageBuilder V2 — Home',
                'meta_description' => 'Local presentation demo of an AI-capable page builder CMS.',
                'published_at' => now(),
                'updated_by' => $admin->id,
            ]
        );
    }
}
