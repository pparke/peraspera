<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('TRUNCATE users CASCADE');
        // seed the initial star systems
        DB::table('users')->insert([
            'name' => 'Dapper Dan',
            'email' => 'dapper@notfop.com',
            'password' => 'badpasswordnosalt'
        ]);
    }
}
