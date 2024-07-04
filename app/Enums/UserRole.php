<?php

namespace App\Enums;


use Illuminate\Support\Facades\Auth;

enum UserRole: int
{
    case GUEST = 0;
    case USER = 10;
    case EDITOR = 50;
    case ADMIN = 100;
}
