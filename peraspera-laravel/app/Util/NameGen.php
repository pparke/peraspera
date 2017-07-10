<?php

namespace App\Util;

class NameGen
{
    private static $consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
    private static $vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    private static $double = ['b', 'd', 'e', 'o', 'g', 'l', 'm', 'n', 'p', 'r', 's', 't'];
    private static $compoundCon = [ 'ch', 'ck', 'gh', 'ng', 'ph', 'qu', 'sc', 'sh', 'th', 'wh', 'bt', 'pt', 'kn', 'gn', 'pn', 'mb', 'lm', 'ps', 'rh', 'wr' ];
    private static $compoundVow = [ 'io', 'ie', 'ia', 'ua', 'eu', 'ae', 'ea', 'oy', 'yo', 'eo', 'oe', 'oa' ];

    public static $frequencies = [
        'english' => [
            'consonants' => [
                'b' => 0.0149,
                'c' => 0.0278,
                'd' => 0.0425,
                'f' => 0.0223,
                'g' => 0.0202,
                'h' => 0.0609,
                'j' => 0.0015,
                'k' => 0.0077,
                'l' => 0.0403,
                'm' => 0.0241,
                'n' => 0.0675,
                'p' => 0.0193,
                'q' => 0.001,
                'r' => 0.0599,
                's' => 0.0633,
                't' => 0.0906,
                'v' => 0.0098,
                'w' => 0.0236,
                'x' => 0.0015,
                'z' => 0.0007
            ],
            'vowels' => [
                'a' => 0.0817,
                'e' => 0.127,
                'i' => 0.0697,
                'o' => 0.0751,
                'u' => 0.0276,
                'y' => 0.0197
            ]
        ]
    ];

    public static function generate($length)
    {
        $name = array();

        for ($i = 0; $i < $length; $i++) {
            if ($i == 0) {
                $name[] = self::getRandomChar();
            } else {
                $name[] = self::getNextChar($name[$i-1]);
            }
        }

        return implode('', $name);
    }

    private static function getNextChar($lastChar)
    {
        if (self::isConsonant($lastChar)) {
            // get a vowel
            return self::getByFrequency(self::$frequencies['english']['vowels']);
        } elseif (self::isVowel($lastChar)) {
            // get a consonant
            return self::getByFrequency(self::$frequencies['english']['consonants']);
        }
    }

    private static function isVowel($char)
    {
        return in_array($char, self::$vowels);
    }

    private static function isConsonant($char)
    {
        return in_array($char, self::$consonants);
    }

    private static function getByFrequency($freqs)
    {
        asort($freqs);
        $prob_sum = array_sum($freqs);
        $probs = [];
        foreach ($freqs as $char => $val) {
            $probs[$char] = ($val / $prob_sum);
        }

        $selection = mt_rand(0, 1000) / 1000;
        $cumulative = 0;
        foreach ($probs as $char => $value) {
            $cumulative += $value;
            if ($selection <= $cumulative) {
                return $char;
            }
        }

        end($probs);
        return key($probs);
    }

    private static function getRandomChar()
    {
        $alpha = array_merge(self::$consonants, self::$vowels);
        return $alpha[mt_rand(0, count($alpha) - 1)];
    }
}
