@extends('layout')

@section('title', $title->name . ' レビュー一覧')
@section('current-node-title', $title->name . ' レビュー一覧')

@section('current-node-content')
    @if (session('success'))
        <div class="alert alert-success mt-3">
            {!! nl2br(e(session('success'))) !!}
        </div>
    @endif

    @php
        $reviewStat   = $title->reviewStatistic;
        $fearMeterStat = $title->fearMeterStatistic;
    @endphp

    @if ($reviewStat !== null || $fearMeterStat !== null)
        <h4 class="mt-3 mb-2">総合評価</h4>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
            {{-- 総合スコア --}}
            <div class="flex items-baseline gap-1">
                @if ($reviewStat?->avg_total_score !== null)
                    <span class="text-2xl font-bold text-slate-100 leading-none">{{ round((float) $reviewStat->avg_total_score) }}</span>
                    <span class="text-xs text-slate-500">/ 100</span>
                @else
                    <span class="text-slate-500">-</span>
                @endif
                @if ($reviewStat !== null)
                    <span class="text-xs text-slate-400 ml-1">{{ $reviewStat->review_count }}件</span>
                @endif
            </div>

            {{-- 怖さメーター --}}
            @if ($fearMeterStat !== null)
                <div class="text-xs text-slate-400 self-end">
                    怖さメーター:
                    <span class="text-slate-200">{{ $fearMeterStat->fear_meter->text() }}</span>
                </div>
            @endif
        </div>

        <div class="mt-1.5 pb-4 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-400">
            @if ($fearMeterStat !== null)
                <span>怖さ: <span class="text-slate-200">{{ number_format((float) $fearMeterStat->average_rating * 10, 1) }}/40</span></span>
            @endif
            @if ($reviewStat?->avg_story !== null)
                <span>ストーリー: <span class="text-slate-300">{{ round((float) $reviewStat->avg_story) }}/20</span></span>
            @endif
            @if ($reviewStat?->avg_atmosphere !== null)
                <span>雰囲気: <span class="text-slate-300">{{ round((float) $reviewStat->avg_atmosphere) }}/20</span></span>
            @endif
            @if ($reviewStat?->avg_gameplay !== null)
                <span>ゲーム性: <span class="text-slate-300">{{ round((float) $reviewStat->avg_gameplay) }}/20</span></span>
            @endif
        </div>
    @endif

    @if ($reviews->isEmpty())
        <p class="mt-3">レビューはまだないようだ。</p>
    @endif

    @auth
        <p class="mt-3 text-sm">
            @if ($myReview)
                <a href="{{ route('Game.TitleReview', ['titleKey' => $title->key, 'reviewKey' => $myReview->key]) }}">自分のレビューを確認</a>
            @else
                <a href="{{ route('User.Review.Form', ['titleKey' => $title->key]) }}">レビューを書く</a>
            @endif
        </p>
    @endauth


@endsection

@section('nodes')
    @foreach ($reviews as $review)
        <section class="node" id="review-{{ $review->user?->show_id }}-node">
            <div class="node-head">
                <span class="node-head-text">{{ $review->user?->name ?? '(不明)' }}さんのレビュー</span>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                @php $fearMeter = $fearMeters[$review->user_id] ?? null; @endphp
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

                {{-- プレイ状況・更新日 --}}
                <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                    @if ($review->play_status !== null)
                        @if ($review->play_status === \App\Enums\PlayStatus::Watched)
                            <span class="text-sky-400">{{ $review->play_status->text() }}</span>
                        @else
                            <span>{{ $review->play_status->text() }}</span>
                        @endif
                    @endif
                    <span class="text-slate-500">{{ $review->updated_at->format('Y-m-d') }}</span>
                </div>

                {{-- 本文 --}}
                @if ($review->has_spoiler)
                    <div class="mt-2 text-sm text-slate-200">ネタバレがあるようだ。全文を読むで表示できる。</div>
                @else
                    <div class="mt-2 text-sm leading-relaxed text-slate-100">{!! nl2br(e(mb_strimwidth($review->body, 0, 200, '…'))) !!}</div>
                @endif
                <div class="mt-1 text-xs">
                    <a href="{{ route('Game.TitleReview', ['titleKey' => $title->key, 'reviewKey' => $review->key]) }}">全文を読む</a>
                </div>
            </div>

            @if ($loop->last)
            <div class="node-content basic" id="under-pager">
                @include('common.pager', ['pager' => $pager])
            </div>
            @endif
        </section>
    @endforeach

@endsection
