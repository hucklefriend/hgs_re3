@php
    $breadcrumbItems = [
        ['label' => 'MY NODE', 'url' => route('User.MyNode.Top')],
    ];
@endphp

@extends('layout')

@section('title', 'マイレビュー')
@section('current-node-title', 'マイレビュー')

@section('current-node-content')
@if (session('success'))
    <div class="alert alert-success mt-3 relative pr-10">
        <button type="button" class="absolute top-0 right-0 p-2 border-0 bg-transparent cursor-pointer" style="line-height: 1;" onclick="this.closest('.alert').style.display='none'" aria-label="閉じる"><i class="bi bi-x"></i></button>
        {!! nl2br(e(session('success'))) !!}
    </div>
@endif
@if ($reviews->isEmpty())
    <p>
        まだレビューを投稿していないようだ。<br>
        <a href="{{ route('Game.Lineup') }}">ラインナップ</a>からタイトルを探して、レビューを書いてみよう。
    </p>
@endif
@endsection

@section('nodes')
    <div class="site-standard-page__sections my-review-list" data-grid-aligned-list>
        @foreach ($reviews as $review)
            @php $fearMeter = $fearMeters[$review->game_title_id] ?? null; @endphp
            <section class="node my-review-card" id="review-{{ $review->game_title_id }}-node">
                <header class="my-review-card__heading-block" data-grid-block>
                    @if (in_array($review->game_title_id, $draftTitleIds))
                        <div class="my-review-card__status"><span class="text-xs px-2 py-1 rounded bg-yellow-600 text-white">下書きあり</span></div>
                    @endif
                    <div class="my-review-card__header">
                        <h2>{{ $review->gameTitle->name }}</h2>
                        <a class="has-site-connection-terminal" href="{{ route('Game.TitleDetail', ['titleKey' => $review->gameTitle->key]) }}" aria-label="{{ $review->gameTitle->name }}のタイトル詳細"><span class="site-connection-label">タイトル詳細<x-site.connection-terminal /></span></a>
                    </div>
                </header>
                <div class="my-review-card__content" data-grid-block>
                    <div class="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
                        {{-- 総合スコア --}}
                        <div class="flex items-baseline gap-1">
                            @if ($review->total_score !== null)
                                <span class="text-2xl font-bold text-slate-100 leading-none">{{ $review->total_score }}</span>
                                <span class="text-xs text-slate-500">/ 100</span>
                            @else
                                <span class="text-slate-500">-</span>
                            @endif
                        </div>

                        {{-- 怖さメーター --}}
                        @if ($fearMeter !== null)
                            <div class="text-xs text-slate-400 self-end">
                                怖さメーター: <span class="text-slate-200">{{ $fearMeter->fear_meter->text() }}</span>
                            </div>
                        @endif
                    </div>

                    {{-- 各スコア --}}
                    <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-400">
                        @if ($fearMeter !== null)
                            <span>怖さ: <span class="text-slate-200">{{ $fearMeter->fear_meter->value * 10 }}/40</span></span>
                        @endif
                        @if ($review->score_story !== null)
                            <span>ストーリー: <span class="text-slate-300">{{ $review->score_story }}/20</span></span>
                        @endif
                        @if ($review->score_atmosphere !== null)
                            <span>雰囲気: <span class="text-slate-300">{{ $review->score_atmosphere }}/20</span></span>
                        @endif
                        @if ($review->score_gameplay !== null)
                            <span>ゲーム性: <span class="text-slate-300">{{ $review->score_gameplay }}/20</span></span>
                        @endif
                        @if ($review->user_score_adjustment !== null)
                            <span>さじ加減: <span class="text-slate-300">{{ $review->user_score_adjustment > 0 ? '+' : '' }}{{ $review->user_score_adjustment }}/20</span></span>
                        @endif
                    </div>

                    {{-- プレイ状況 --}}
                    <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                        @if ($review->play_status !== null)
                            @if ($review->play_status === \App\Enums\PlayStatus::Watched)
                                <span class="text-sky-400">{{ $review->play_status->text() }}</span>
                            @else
                                <span>{{ $review->play_status->text() }}</span>
                            @endif
                        @endif
                    </div>

                    <div class="my-review-card__excerpt">
                        {{-- 本文 --}}
                        @if ($review->has_spoiler)
                            <div class="mt-2 text-xs text-amber-400">【ネタバレあり】</div>
                        @endif
                        @if ($review->body)
                            <div class="my-review-card__body text-sm text-slate-100">{!! nl2br(e($review->body)) !!}</div>
                        @endif
                    </div>
                </div>
                <footer class="my-review-card__footer" data-grid-block>
                    <time datetime="{{ $review->updated_at->toIso8601String() }}">更新 {{ $review->updated_at->format('Y-m-d') }}</time>
                    <nav class="my-review-card__actions" aria-label="{{ $review->gameTitle->name }}のレビュー操作">
                        <a class="has-site-connection-terminal" href="{{ route('Game.TitleReview', ['titleKey' => $review->gameTitle->key, 'reviewKey' => $review->key]) }}"><span class="site-connection-label">レビューを見る<x-site.connection-terminal /></span></a>
                        <a class="my-review-card__edit has-site-connection-terminal" href="{{ route('User.Review.Form', ['titleKey' => $review->gameTitle->key]) }}"><span class="site-connection-label">編集する<x-site.connection-terminal /></span></a>
                    </nav>
                </footer>
            </section>
        @endforeach
        @if ($reviews->isNotEmpty())
            <div id="under-pager">
                @include('common.pager', ['pager' => $pager])
            </div>
        @endif
    </div>
@endsection
