<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
  /**
   * Mass assignable attributes
   */
  protected $fillable = ['name', 'description'];

  public function sector()
  {
    return $this->belongsTo(Sector::class);
  }

  /**
   * Ships that are currently docked at the station
   * @return [type] [description]
   */
  public function ships()
  {
    return $this->hasMany(Ship::class);
  }

  /**
   * The items preset on the station, both equipped and unequipped
   * @return [type] [description]
   */
  public function items()
  {
    return $this->hasMany(Item::class);
  }
}
