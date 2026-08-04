<?php

namespace App\Models;

use Database\Factories\HeroRevisionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['hero_id', 'source', 'changed_fields', 'status', 'reviewed_at'])]
class HeroRevision extends Model
{
    /** @use HasFactory<HeroRevisionFactory> */
    use HasFactory;

    /** @return BelongsTo<Hero, $this> */
    public function hero(): BelongsTo
    {
        return $this->belongsTo(Hero::class);
    }

    protected function casts(): array
    {
        return ['changed_fields' => 'array', 'reviewed_at' => 'datetime'];
    }
}
