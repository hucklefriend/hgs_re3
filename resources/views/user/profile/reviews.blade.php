@extends('layout')

@section('title', $profileUser->name . 'さんのレビュー')
@section('current-node-title', $profileUser->name . 'さんのレビュー')

@section('current-node-content')
    @if ($isBlocked)
        <p class="mt-3 text-slate-400">このユーザーのコンテンツは表示できません。</p>
    @elseif ($reviews->isEmpty())
        <p class="mt-3">まだレビューはありません。</p>
    @endif
@endsection

@section('nodes')
    @if (!$isBlocked)
        @foreach ($reviews as $review)
            @php $fearMeter = $fearMeters[$review->game_title_id] ?? null; @endphp
            <section class="node" id="review-{{ $review->game_title_id }}-node">
                <div class="node-head">
                    <span class="node-head-text">
                        <a href="{{ route('Game.TitleReview', ['titleKey' => $review->gameTitle->key, 'reviewKey' => $review->key]) }}" data-hgn-scope="full">{{ $review->gameTitle->name }}</a>
                    </span>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content basic">
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

                    {{-- ネタバレ表示 --}}
                    @if ($review->has_spoiler)
                        <div class="mt-2 text-xs text-amber-400">【ネタバレあり】</div>
                    @endif

                    {{-- リンク --}}
                    <div class="mt-2 text-xs">
                        <a href="{{ route('Game.TitleReview', ['titleKey' => $review->gameTitle->key, 'reviewKey' => $review->key]) }}" data-hgn-scope="full"><i class="bi bi-file-text"></i> 表示</a>
                    </div>
                </div>

                @if ($loop->last)
                    <div class="node-content basic" id="under-pager">
                        @include('common.pager', ['pager' => $pager])
                    </div>
                @endif
            </section>
        @endforeach
    @endif

    @include('common.shortcut', ['shortcutRoute' => $shortcutRoute])
@endsection
