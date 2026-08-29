@props([
    'title',
    'headingId' => null,
    'titleClass' => null,
])

<div {{ $attributes->class(['site-timeline-heading']) }}>
    <p class="site-timeline-heading__label">TIMELINE</p>
    <h2 @class(['site-timeline-heading__title', $titleClass]) @if ($headingId !== null) id="{{ $headingId }}" @endif>{{ $title }}</h2>
</div>
