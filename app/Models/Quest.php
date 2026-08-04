<?php

namespace App\Models;

use Database\Factories\QuestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'summary', 'location', 'difficulty', 'status', 'starts_at', 'ends_at', 'party_limit', 'requirements'])]
class Quest extends Model
{
    /** @use HasFactory<QuestFactory> */
    use HasFactory;

    /** @return HasMany<Enlistment, $this> */
    public function enlistments(): HasMany
    {
        return $this->hasMany(Enlistment::class);
    }

    protected function casts(): array
    {
        return ['starts_at' => 'datetime', 'ends_at' => 'datetime', 'requirements' => 'array'];
    }
}
