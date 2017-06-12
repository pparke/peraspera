<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    /**
     * Mass assignable attributes
     */
    protected $fillable = ['coord_x', 'coord_y'];

    /**
     * The stations present in the sector
     * @return [type] [description]
     */
    public function stations()
    {
      return $this->hasMany(Station::class);
    }

    /**
     * The planets in the sector
     * @return [type] [description]
     */
    public function planets()
    {
      return $this->hasMany(Planet::class);
    }

    /**
     * The ships currently in the sector
     * @return [type] [description]
     */
    public function ships()
    {
      return $this->hasMany(Ship::class);
    }

    /**
     * The system that the sector is a part of
     * @return [type] [description]
     */
    public function system()
    {
      return $this->belongsTo(System::class);
    }
}
