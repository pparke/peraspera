<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Util\NameGen;

class NameGenTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testInstantiation()
    {
        $gen = new NameGen();
        $this->assertInstanceOf(NameGen::class, $gen);
    }

    public function testGetByFrequency()
    {
        $char = $this->invokeMethod(new NameGen(), 'getByFrequency', [NameGen::$frequencies['english']['vowels']]);
        echo $char;
        $this->assertTrue(is_string($char), "getByFrequency did not return a string");
    }

    public function testGetRandomChar()
    {
        $char = $this->invokeMethod(new NameGen(), 'getRandomChar', [NameGen::$frequencies['english']['consonants']]);
        echo $char;
        $this->assertTrue(is_string($char), "getRandomChar did not return a string");
    }

    public function testIsVowel()
    {
        $this->assertTrue($this->invokeMethod(new NameGen(), 'isVowel', ['a']));
        $this->assertNotTrue($this->invokeMethod(new NameGen(), 'isVowel', ['b']));
    }

    public function testIsConsonant()
    {
        $this->assertTrue($this->invokeMethod(new NameGen(), 'isConsonant', ['f']));
        $this->assertNotTrue($this->invokeMethod(new NameGen(), 'isConsonant', ['e']));
    }

    public function testGenerate()
    {
        $word = $this->invokeMethod(new NameGen(), 'generate', [7]);
        echo $word;
    }
}
