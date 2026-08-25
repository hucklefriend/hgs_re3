@props(['pageKind', 'pageTitle', 'items' => []])

<nav class="site-breadcrumb" aria-label="パンくず">
    <a href="{{ route('Root') }}">ROOT<x-site.connection-terminal /></a>
    <span aria-hidden="true">/</span>
    @foreach ($items as $item)
        <a href="{{ $item['url'] }}">{{ $item['label'] }}<x-site.connection-terminal /></a>
        <span aria-hidden="true">/</span>
    @endforeach
    <span>{{ $pageTitle !== '' ? $pageTitle : strtoupper($pageKind) }}</span>
</nav>
