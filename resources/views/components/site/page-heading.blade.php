@props([
    'label',
    'headingId' => null,
    'titleClass' => null,
])

<div {{ $attributes->class(['site-page-heading']) }}>
    <p class="site-page-heading__label">{{ $label }}</p>
    <h1 @class(['site-page-heading__title', $titleClass]) @if ($headingId !== null) id="{{ $headingId }}" @endif>{{ $slot }}</h1>
</div>
