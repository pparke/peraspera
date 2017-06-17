<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ship;
use App\Sector;

use App\Http\Requests;

class ShipController extends Controller
{
    const SYSTEM_DIST_FACTOR = 10;
    const MPG = 1;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(['ships' => Ship::all()]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $ship = Ship::findOrFail($id);
        return response()->json([
            'ship' => $ship,
            'sector' => $ship->sector,
            'system' => $ship->sector->system
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function distanceBetween($coorda, $coordb)
    {
        return sqrt(pow($coorda->x_coord - $coordb->x_coord) + pow($coorda->y_coord - $coordb->y_coord));
    }

    public function move($ship_id, $sector_id)
    {
        $ship = Ship::findOrFail($ship_id);
        $sector = Sector::findOrFail($sector_id);

        $distance = 0;
        if ($sector->system === $ship->sector->system) {
            // calculate distance from current sector
            $distance = $this->distanceBetween($sector, $ship->sector);
        } else {
            // get distance between systems
            $distance = $this->distanceBetween($sector->system, $ship->sector->system);
            $distance *= self::SYSTEM_DIST_FACTOR;
        }
        // calculate fuel cost and compare to current fuel
        $fuel_cost = $distance * self::MPG;
        // if there is enough fuel, set timer that will move the ship
        if ($fuel_cost < $ship->fuel) {

        }
        // and deduct the fuel once complete
        // move ship through intervening sectors?
        $ship->sector_id = $sector->id;
        $ship->save();

        return response()->json([
            'ship' => $ship,
            'sector' => $ship->sector,
            'system' => $ship->sector->system
        ]);
    }
}
