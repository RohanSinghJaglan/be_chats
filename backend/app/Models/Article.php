<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'published_at',
        'excerpt',
        'original_content',
        'rewritten_content',
        'source_url',
        'status',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];
}
