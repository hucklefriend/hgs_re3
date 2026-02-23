<?php

namespace App\Enums;

enum SocialAccountProvider: int
{
    case GitHub = 1;
    case Google = 2;
    case Facebook = 3;
    case X = 4;
    case Yahoo = 5;
}
