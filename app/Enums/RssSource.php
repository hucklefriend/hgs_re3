<?php

namespace App\Enums;

enum RssSource: string
{
    case FourGamer  = '4gamer';
    case Automaton  = 'automaton';
    case GameWatch  = 'game_watch';
    case GameSpark  = 'game_spark';

    public function label(): string
    {
        return match ($this) {
            self::FourGamer => '4Gamer',
            self::Automaton => 'AUTOMATON',
            self::GameWatch => 'Game Watch',
            self::GameSpark => 'Game*Spark',
        };
    }

    public function feedUrl(): string
    {
        return match ($this) {
            self::FourGamer => 'https://www.4gamer.net/rss/index.xml',
            self::Automaton => 'https://automaton-media.com/feed/',
            self::GameWatch => 'https://game.watch.impress.co.jp/data/rss/1.0/gmw/feed.rdf',
            self::GameSpark => 'https://www.gamespark.jp/rss20/index.rdf',
        };
    }
}
