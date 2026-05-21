<?php

namespace App\Enums;

enum TimelineSubjectType: string
{
    case Review = 'review';
    case GameTitle = 'game_title';
    case Information = 'information';
}
