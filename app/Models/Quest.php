<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'summary', 'location', 'difficulty', 'status', 'starts_at', 'ends_at', 'party_limit', 'requirements'])]
class Quest extends Model
{
    /** @use HasFactory<\Database\Factories\QuestFactory> */
    use HasFactory;

    public function enlistments(): HasMany
    {
        return $this->hasMany(Enlistment::class);
    }

    protected function casts(): array
    {
        return ['starts_at' => 'datetime', 'ends_at' => 'datetime', 'requirements' => 'array'];
    }
}
