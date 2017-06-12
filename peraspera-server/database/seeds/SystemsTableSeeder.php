<?php

use Illuminate\Database\Seeder;

class SystemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('TRUNCATE systems CASCADE');
        // seed the initial star systems
        factory(App\System::class, 100)->create()->each(function ($s) {
            for ($x = 0; $x < 8; $x++) {
                for ($y = 0; $y < 8; $y++) {
                    DB::table('sectors')->insert([
                        'coord_x' => $x,
                        'coord_y' => $y,
                        'system_id' => $s->id
                    ]);
                }
            }
        });
    }
}
