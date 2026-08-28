@extends('layout')

@section('title', $platform->name)
@section('current-node-title', $platform->name)

@section('current-node-content')
    <blockquote class="description">
        {!! nl2br($platform->description); !!}
        @if ($platform->description_source !== null)
            <footer>
                — <cite>{!! $platform->description_source !!}</cite>
            </footer>
        @endif
    </blockquote>
@endsection


@section('nodes')

    @if ($platform->relatedProducts->count() > 0)
        <section class="node tree-node" id="hardware-tree-node">
            <div class="node-head">
                <h2 class="node-head-text">ハードウェア</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @foreach ($platform->relatedProducts as $rp)
                    <section class="node basic" id="{{ $rp->key }}-link-node">
                        <div class="node-head">
                            <h2 class="node-head-text">{{ $rp->name }}</h2>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                @endforeach
            </div>
        </section>
    @endif

    @if ($titles->count() > 0)
    <section class="lineup-franchise platform-title-catalog" id="title-tree-node">
        <header>
            <div>
                <p>LINEUP NODE</p>
                <h2>タイトル</h2>
            </div>
        </header>
        <div class="platform-title-grid">
            @foreach ($titles as $title)
                @php
                    $titleDescription = '';
                    if ($title->use_ogp_description == 1 && $title->ogp !== null && !empty($title->ogp->description)) {
                        $titleDescription = $title->ogp->description;
                    } elseif (!empty($title->description)) {
                        $titleDescription = trim(strip_tags($title->description));
                    }
                @endphp
                <a class="platform-title-card" href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" id="{{ $title->key }}-link-node">
                    <span class="platform-title-card__image">
                        @if ($title->ogp !== null && !empty($title->ogp->image))
                            <img src="{{ $title->ogp->image }}" width="{{ $title->ogp->image_width }}" height="{{ $title->ogp->image_height }}" alt="" loading="lazy">
                        @else
                            <span class="platform-title-card__placeholder" aria-hidden="true"><i></i>NO IMAGE SIGNAL</span>
                        @endif
                    </span>
                    <span class="platform-title-card__body">
                        <span class="platform-title-card__type">GAME TITLE</span>
                        <b><i aria-hidden="true"></i>{{ $title->name }}</b>
                        @if ($titleDescription !== '')
                            <span class="platform-title-card__description">{{ $titleDescription }}</span>
                        @else
                            <span class="platform-title-card__description platform-title-card__description--empty">作品説明はまだ登録されていません。</span>
                        @endif
                    </span>
                </a>
            @endforeach
        </div>
        @if ($pager->hasMultiplePages())
            <div class="lineup-results__pager platform-title-catalog__pager">
                @include('common.pager', ['pager' => $pager])
            </div>
        @endif
    </section>
    @endif
@endsection
