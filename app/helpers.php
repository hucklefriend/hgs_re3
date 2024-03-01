<?php

function menu_active(string $match, bool $isPerfectMatch = false): string
{
    if ($isPerfectMatch) {
        return (Request::route()->getName() === $match) ? 'active' : '';
    } else {
        return str_starts_with(Request::route()->getName(), $match) ? 'active' : '';
    }
}
