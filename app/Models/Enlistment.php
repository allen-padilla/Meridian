<?php

namespace App\Models;

use Database\Factories\EnlistmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['quest_id', 'hero_id', 'status', 'mustered_at', 'responses'])]
class Enlistment extends Model
{
    /** @use HasFactory<EnlistmentFactory> */
    use HasFactory;

    /** @return BelongsTo<Hero, $this> */
    public function hero(): BelongsTo
    {
        return $this->belongsTo(Hero::class);
    }

    /** @return BelongsTo<Quest, $this> */
    public function quest(): BelongsTo
    {
        return $this->belongsTo(Quest::class);
    }

    protected function casts(): array
    {
        return ['mustered_at' => 'datetime', 'responses' => 'array'];
    }
}
