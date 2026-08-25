@props([
    'series',
    'titles' => null,
    'excludeTitleId' => null,
])

@php
    $seriesTitles = $titles ?? $series->titles;
@endphp

<section {{ $attributes->class(['lineup-series']) }}>
    <h4><span>{{ $series->name }}<small>シリーズ</small></span></h4>
    @foreach ($seriesTitles as $seriesTitle)
        @continue($excludeTitleId !== null && $seriesTitle->id === $excludeTitleId)
        <a href="{{ route('Game.TitleDetail', ['titleKey' => $seriesTitle->key]) }}" id="{{ $seriesTitle->key }}-link-node"><span class="lineup-result-signal" aria-hidden="true"></span><b>{{ $seriesTitle->name }}</b></a>
    @endforeach
</section>
