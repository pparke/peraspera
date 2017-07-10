<?php

use App\Util\NameGen;
use App\System;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->safeEmail,
        'password' => bcrypt(str_random(10)),
        'remember_token' => str_random(10),
    ];
});

$factory->define(App\System::class, function (Faker\Generator $faker) {
    return [
        'name' => NameGen::generate(mt_rand(4, 10)),
        'description' => '',
        'star_type' => System::$types[mt_rand(0, count(System::$types) - 1)],
        'coord_x' => mt_rand(0, System::$COORDMAX),
        'coord_y' => mt_rand(0, System::$COORDMAX)
    ];
});
