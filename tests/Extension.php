<?php
namespace Tests;

use PHPUnit\Runner\Extension\Extension as RunnerExtension;
use PHPUnit\Runner\Extension\Facade;
use PHPUnit\Runner\Extension\ParameterCollection;
use PHPUnit\TextUI\Configuration\Configuration;
use Tests\Subscribers\TestFailedSubscriber;

final class Extension implements RunnerExtension
{
    public function bootstrap(Configuration $configuration, Facade $facade, ParameterCollection $parameters): void
    {
        $facade->registerSubscribers(TestFailedSubscriber::getInstance());
    }
}
