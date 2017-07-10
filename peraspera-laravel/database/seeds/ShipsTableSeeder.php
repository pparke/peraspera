<?php

use Illuminate\Database\Seeder;

class ShipsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('TRUNCATE ships CASCADE');
        // seed the initial star systems
        DB::table('ships')->insert([
            'name' => 'Viper',
            'hull_integrity' => 100,
            'user_id' => 1,
            'sector_id' => DB::table('sectors')->select('id')->first()->id
        ]);
    }
}
