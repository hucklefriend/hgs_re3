<?php

namespace App\Helpers;

class MecabHelper
{
    public static function parse($text)
    {
        $command = "echo " . escapeshellarg($text) . " | mecab";
        return shell_exec($command);
    }
}
