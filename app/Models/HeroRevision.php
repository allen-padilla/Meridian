<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['hero_id', 'source', 'changed_fields', 'status', 'reviewed_at'])]
class HeroRevision extends Model
{
    /** @use HasFactory<\Database\Factories\HeroRevisionFactory> */
    use HasFactory;

    public function hero(): BelongsTo
    {
        return $this->belongsTo(Hero::class);
    }

    protected function casts(): array
    {
        return ['changed_fields' => 'array', 'reviewed_at' => 'datetime'];
    }
}
