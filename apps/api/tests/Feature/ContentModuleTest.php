<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContentModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_users_can_crud_content_modules(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'editor']));

        $created = $this->postJson('/api/content-modules', [
            'type' => 'promotion',
            'title' => 'Summer Campaign',
            'body' => '<p>Campaign details</p>',
            'status' => 'published',
            'starts_at' => '2026-07-01',
            'ends_at' => '2026-07-31',
            'is_pinned' => true,
        ]);

        $created
            ->assertCreated()
            ->assertJsonPath('type', 'promotion')
            ->assertJsonPath('slug', 'summer-campaign');

        $moduleId = $created->json('id');

        $this->getJson('/api/content-modules?type=promotion')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $moduleId);

        $this->putJson("/api/content-modules/{$moduleId}", [
            'title' => 'Updated Summer Campaign',
            'status' => 'archived',
        ])
            ->assertOk()
            ->assertJsonPath('title', 'Updated Summer Campaign')
            ->assertJsonPath('status', 'archived');

        $this->deleteJson("/api/content-modules/{$moduleId}")
            ->assertOk()
            ->assertJsonPath('message', 'Deleted');

        $this->assertDatabaseMissing('content_modules', ['id' => $moduleId]);
    }

    public function test_content_module_type_is_validated(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'editor']));

        $this->postJson('/api/content-modules', [
            'type' => 'unsupported',
            'title' => 'Invalid module',
        ])->assertUnprocessable();

        $this->assertDatabaseCount('content_modules', 0);
    }
}
