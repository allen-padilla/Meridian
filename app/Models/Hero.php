<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['hero_code', 'name', 'epithet', 'email', 'ancestry', 'class', 'level', 'home_realm', 'faction', 'verification_status', 'standing_status', 'guild_crest_issued', 'last_seen_at'])]
class Hero extends Model
{
    /** @use HasFactory<\Database\Factories\HeroFactory> */
    use HasFactory;

    public function enlistments(): HasMany
    {
        return $this->hasMany(Enlistment::class);
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(HeroRevision::class);
    }

    protected function casts(): array
    {
        return ['guild_crest_issued' => 'boolean', 'last_seen_at' => 'datetime'];
    }
}
