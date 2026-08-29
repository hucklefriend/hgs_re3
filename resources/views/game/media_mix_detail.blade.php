@extends('layout')

@php
    $mediaMixDescription = '';
    if ($mediaMix->use_ogp_description == 1 && $mediaMix->ogp !== null && !empty($mediaMix->ogp->description)) {
        $mediaMixDescription = $mediaMix->ogp->description;
    } elseif (!empty($mediaMix->description)) {
        $mediaMixDescription = trim(strip_tags($mediaMix->description));
    }
    $relatedProducts = $mediaMix->relatedProducts->sortByDesc('sort_order');
    $relatedMediaMixes = collect();
    if ($mediaMix->mediaMixGroup !== null) {
        $relatedMediaMixes = $mediaMix->mediaMixGroup->mediaMixes
            ->reject(fn ($sameMediaMix) => $sameMediaMix->id === $mediaMix->id)
            ->sortBy('sort_order');
    }
@endphp

@section('title', $mediaMix->name)
@section('body-class', 'site-page site-page--media-mix-detail')
@section('current-node-title', $mediaMix->name)
@section('ratingCheck', $mediaMix->rating == \App\Enums\Rating::None ? 'false' : 'true')

@section('ogp')
    @include('common.ogp_meta', [
        'ogpTitle' => $mediaMix->name,
        'ogpDescription' => $mediaMixDescription,
        'ogpImage' => $mediaMix->ogp?->image ?? '/img/ogp.png',
        'ogpUrl' => route('Game.MediaMixDetail', ['mediaMixKey' => $mediaMix->key]),
        'ogpType' => 'article',
    ])
@endsection

@if (is_admin_user())
    @section('site-footer-action')
        <a href="{{ route('Admin.Game.MediaMix.Detail', $mediaMix) }}" class="site-footer-action__link">管理へ</a>
    @endsection
@endif

@section('site-content')
    <section class="title-hero" aria-labelledby="media-mix-detail-name">
        <div class="site-frame title-hero__frame" data-grid-frame>
            <nav class="title-breadcrumb" aria-label="パンくず">
                <a href="{{ route('Root') }}">ROOT</a><span>/</span>
                <a href="{{ route('Game.Lineup') }}">LINEUP</a><span>/</span>
                @if ($franchise)
                    <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}">{{ $franchise->name }}フランチャイズ</a><span>/</span>
                @endif
                <b>{{ $mediaMix->name }}</b>
            </nav>

            <article class="title-hero__panel">
                <header class="site-standard-page__header title-hero__header node-head">
                    <x-site.page-heading label="MEDIA MIX" heading-id="media-mix-detail-name" title-class="node-head-text">{{ $mediaMix->name }}</x-site.page-heading>
                </header>

                <div class="title-hero__content">
                    @if ($mediaMix->ogp !== null && !empty($mediaMix->ogp->image))
                        <div @class(['title-keyart', 'title-keyart--tall' => (int) $mediaMix->ogp->image_height > 1000])>
                            <img src="{{ $mediaMix->ogp->image }}" width="{{ $mediaMix->ogp->image_width }}" height="{{ $mediaMix->ogp->image_height }}" alt="{{ $mediaMix->name }}">
                        </div>
                    @endif

                    <div class="title-summary">
                        @if ($mediaMixDescription !== '')
                            <p class="title-summary__description">{{ $mediaMixDescription }}</p>
                        @else
                            <p class="title-summary__description title-summary__description--empty">この作品について、詳しいことはまだわからない。</p>
                        @endif
                        <dl class="title-facts">
                            <div><dt>MEDIA TYPE</dt><dd>{{ $mediaMix->type->text() }}</dd></div>
                            <div>
                                <dt>FRANCHISE</dt>
                                <dd>
                                    @if ($franchise)
                                        <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}">{{ $franchise->name }}フランチャイズ</a>
                                    @else
                                        —
                                    @endif
                                </dd>
                            </div>
                            <div><dt>MEDIA MIX GROUP</dt><dd>{{ $mediaMix->mediaMixGroup?->name ?? '—' }}</dd></div>
                        </dl>
                    </div>
                </div>
            </article>
        </div>
    </section>

    <section class="title-detail-body">
        <div class="site-frame title-detail-layout">
            <nav class="title-detail-menu" aria-label="ページ内メニュー" data-section-spy>
                <p>SELECT DATA</p>
                <a class="is-active" href="#related-products"><span>01</span><b>関連商品</b><small>RELATED PRODUCTS</small></a>
                @if ($relatedMediaMixes->isNotEmpty())
                    <a href="#related"><span>02</span><b>関連作品</b><small>RELATED ENTRIES</small></a>
                @endif
            </nav>

            <div class="title-detail-content">
                <section class="title-data-section" id="related-products">
                    <header><span>01</span><div><p>RELATED PRODUCTS</p><h2>関連商品</h2></div></header>
                    <div class="title-package-list">
                        @forelse ($relatedProducts as $relatedProduct)
                            <article>
                                <header class="title-package-group__header">
                                    <h3>{{ $relatedProduct->node_name }}</h3>
                                    @if (!empty($relatedProduct->description))
                                        <p class="title-package-description">{{ $relatedProduct->description }}</p>
                                    @endif
                                </header>
                                <div class="title-related-product-shops">
                                    @forelse ($relatedProduct->shops->sortBy('shop_id') as $shop)
                                        <section class="title-related-product-shop">
                                            <div class="title-related-product-shop__visual">
                                                @if ($shop->ogp !== null && !empty($shop->ogp->image))
                                                    <a href="{{ $shop->url }}" target="_blank" rel="noopener sponsored" aria-label="{{ $relatedProduct->node_name }}を{{ strip_tags($shop->shop()?->name() ?? 'ショップ') }}で見る">
                                                        <img src="{{ $shop->ogp->image }}" width="{{ $shop->ogp->image_width }}" height="{{ $shop->ogp->image_height }}" alt="{{ $relatedProduct->node_name }}" loading="lazy">
                                                    </a>
                                                @elseif (!empty($shop->img_tag))
                                                    {!! $shop->img_tag !!}
                                                @else
                                                    <a href="{{ $shop->url }}" target="_blank" rel="noopener sponsored" aria-label="{{ $relatedProduct->node_name }}を{{ strip_tags($shop->shop()?->name() ?? 'ショップ') }}で見る">
                                                        <img src="{{ $relatedProduct->default_img_type->imgUrl() }}" alt="{{ $relatedProduct->node_name }}" loading="lazy">
                                                    </a>
                                                @endif
                                            </div>
                                            <a class="title-related-product-shop__name" href="{{ $shop->url }}" target="_blank" rel="noopener sponsored">
                                                @if (!empty($shop->subtitle))<span>{!! $shop->subtitle !!}</span>@endif
                                                <b>{!! $shop->shop()?->name() ?? 'STORE' !!}</b>
                                                <i aria-hidden="true">↗</i>
                                            </a>
                                        </section>
                                    @empty
                                        <p class="site-empty-state">この品物の入手先は、まだわからない。</p>
                                    @endforelse
                                </div>
                            </article>
                        @empty
                            <p class="site-empty-state">ここには、関連する品物は見当たらないようだ。</p>
                        @endforelse
                    </div>
                </section>

                @if ($relatedMediaMixes->isNotEmpty())
                    <section class="title-data-section" id="related">
                        <header><span>02</span><div><p>RELATED ENTRIES</p><h2>関連作品</h2></div></header>
                        <div class="lineup-franchise__entries">
                            <section class="lineup-series">
                                @if ($mediaMix->mediaMixGroup)
                                    <h4>{{ $mediaMix->mediaMixGroup->name }}</h4>
                                @endif
                                @foreach ($relatedMediaMixes as $sameMediaMix)
                                    <a href="{{ route('Game.MediaMixDetail', ['mediaMixKey' => $sameMediaMix->key]) }}" id="{{ $sameMediaMix->key }}-link-node"><span class="lineup-result-signal" aria-hidden="true"></span><b>{{ $sameMediaMix->name }}</b></a>
                                @endforeach
                            </section>
                        </div>
                    </section>
                @endif
            </div>
        </div>
    </section>
@endsection
