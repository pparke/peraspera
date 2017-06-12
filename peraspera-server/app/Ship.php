<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ship extends Model
{
  /**
   * Mass assignable attributes
   */
  protected $fillable = ['name', 'description'];

  /**
   * The sector the ship is currently in
   * @return [type] [description]
   */
  public function sector()
  {
    return $this->belongsTo(Sector::class);
  }

  /**
   * The items preset on the ship, both equipped and unequipped
   * @return [type] [description]
   */
  public function items()
  {
    return $this->hasMany(Item::class);
  }
}
