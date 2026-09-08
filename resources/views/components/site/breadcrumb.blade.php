@props(['pageKind', 'pageTitle', 'items' => []])

<nav class="site-breadcrumb" aria-label="パンくず">
    <a href="{{ route('Root') }}"><span class="site-connection-label site-connection-label--mono">ROOT<x-site.connection-terminal /></span></a>
    <span aria-hidden="true">/</span>
    @foreach ($items as $item)
        <a href="{{ $item['url'] }}"><span class="site-connection-label site-connection-label--mono">{{ $item['label'] }}<x-site.connection-terminal /></span></a>
        <span aria-hidden="true">/</span>
    @endforeach
    <span>{{ $pageTitle !== '' ? $pageTitle : strtoupper($pageKind) }}</span>
</nav>
