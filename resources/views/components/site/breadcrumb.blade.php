@props(['pageKind', 'pageTitle'])

<nav class="site-breadcrumb" aria-label="パンくず">
    <a href="{{ route('Root') }}">HORROR GAME NETWORK<x-site.connection-terminal /></a>
    <span aria-hidden="true">/</span>
    <span>{{ $pageTitle !== '' ? $pageTitle : strtoupper($pageKind) }}</span>
</nav>
