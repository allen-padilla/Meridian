<?php

use App\Models\Enlistment;
use App\Models\Hero;
use App\Models\Quest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('a guildkeeper can browse the hero ledger', function () {
    $user = User::factory()->create();
    Hero::factory()->create(['hero_code' => 'M-1001', 'name' => 'Talia Rune']);

    $this->actingAs($user)->get(route('heroes.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('heroes/index')->has('heroes', 1));
});

test('the revisions and archive navigation destinations are distinct pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('revisions.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('revisions/index'));

    $this->get(route('archive.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('archive/index'));
});

test('a quest without requirements can be opened', function () {
    $user = User::factory()->create();
    $quest = Quest::factory()->create(['requirements' => null]);

    $this->actingAs($user)->get(route('quests.show', $quest))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('quests/show')
            ->where('quest.requirements', [])
            ->has('quest.enlistments', 0));
});

test('a quest with double encoded requirements can be opened', function () {
    $user = User::factory()->create();
    $requirements = ['Bring a guild crest', 'Carry a healing draught'];
    $quest = Quest::factory()->create(['requirements' => json_encode($requirements)]);

    $this->actingAs($user)->get(route('quests.show', $quest))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('quests/show')
            ->where('quest.requirements', $requirements));
});

test('muster creates a walk-in enlistment and toggles field presence', function () {
    $user = User::factory()->create();
    $hero = Hero::factory()->create(['hero_code' => 'M-1002']);
    $quest = Quest::factory()->create();

    $this->actingAs($user)->post(route('quests.muster', $quest), ['hero_code' => $hero->hero_code])->assertRedirect();
    expect(Enlistment::first()->status)->toBe('present');

    $this->post(route('quests.muster', $quest), ['hero_code' => $hero->hero_code])->assertRedirect();
    expect(Enlistment::first()->fresh()->status)->toBe('departed');
});

test('muster rejects an unknown rune', function () {
    $this->actingAs(User::factory()->create())
        ->from(route('quests.index'))
        ->post(route('quests.muster', Quest::factory()->create()), ['hero_code' => 'UNKNOWN'])
        ->assertSessionHasErrors('hero_code');
});
