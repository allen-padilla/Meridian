<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['quest_id', 'hero_id', 'status', 'mustered_at', 'responses'])]
class Enlistment extends Model
{
    /** @use HasFactory<\Database\Factories\EnlistmentFactory> */
    use HasFactory;

    public function hero(): BelongsTo
    {
        return $this->belongsTo(Hero::class);
    }

    public function quest(): BelongsTo
    {
        return $this->belongsTo(Quest::class);
    }

    protected function casts(): array
    {
        return ['mustered_at' => 'datetime', 'responses' => 'array'];
    }
}
