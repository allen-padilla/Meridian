<?php

namespace Tests\Feature;

use App\Models\Enlistment;
use App\Models\Hero;
use App\Models\Quest;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
    }

    public function test_hero_analytics_are_calculated_from_ledger_records()
    {
        $user = User::factory()->create();
        $heroes = Hero::factory()->count(4)->create([
            'verification_status' => 'verified',
            'last_seen_at' => now()->subDays(10),
        ]);
        Hero::factory()->create([
            'verification_status' => 'unverified',
            'last_seen_at' => null,
        ]);
        $quest = Quest::factory()->create();
        Enlistment::create([
            'quest_id' => $quest->id,
            'hero_id' => $heroes->first()->id,
            'status' => 'present',
            'mustered_at' => now(),
        ]);

        $this->actingAs($user)
            ->get(route('heroes.analytics'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('heroes/analytics')
                ->where('overview.totalHeroes', 5)
                ->where('overview.verifiedRate', 80)
                ->where('overview.activeRate', 80)
                ->where('overview.participationRate', 20)
                ->where('questActivity.totalEnlistments', 1)
                ->where('questActivity.musteredEnlistments', 1)
            );
    }

    public function test_demo_seeder_creates_a_reporting_sized_dataset()
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('heroes', 100);
        $this->assertDatabaseCount('quests', 50);
        $this->assertGreaterThan(100, Enlistment::count());
        $this->assertIsArray(Quest::where('name', 'Guild Chronicle 01')->firstOrFail()->requirements);

        $enlistmentCount = Enlistment::count();

        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('heroes', 100);
        $this->assertDatabaseCount('quests', 50);
        $this->assertDatabaseCount('enlistments', $enlistmentCount);
    }
}
