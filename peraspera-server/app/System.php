<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class System extends Model
{
    /**
     * Mass assignable attributes
     */
    protected $fillable = [
      'name',
      'description',
      'star_type',
      'coord_x',
      'coord_y'
    ];

    public static $COORDMAX = 500;
    public static $types = [
      'stellar nebula',
      'planetary nebula',
      'red giant',
      'blue giant',
      'red supergiant',
      'neutron',
      'white dwarf',
      'brown dwarf',
      'red dwarf',
      'orange',
      'yellow',
      'yellow-white',
      'white',
      'blue-white',
      'blue',
      'black hole'
    ];

    /**
     * The sectors that make up the system
     * @return [type] [description]
     */
    public function sectors()
    {
      return $this->hasMany(Sector::class);
    }
}
