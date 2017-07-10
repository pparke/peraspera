<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
  /**
   * Mass assignable attributes
   */
  protected $fillable = [
    'name', 'description', 'item_type', 'rating', 'max_condition', 'condition'
  ];


}
