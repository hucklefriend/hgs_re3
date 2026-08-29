@extends('layout')

@section('title', 'いいねしたレビュー')
@section('current-node-title', 'いいねしたレビュー')

@section('current-node-content')
@if ($likes->isEmpty())
    <p>気に留めたレビューは、まだないようだ。</p>
@endif
@endsection

@section('nodes')
    @if ($likes->isNotEmpty())
        <section class="node" id="review-likes-list-node">
            <div class="node-head">
                <h2 class="node-head-text">いいねしたレビュー</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <div class="space-y-3">
                    @foreach ($likes as $like)
                        @php
                            $review = $like->review;
                        @endphp
                        <div class="border border-slate-600 rounded p-3 text-sm">
                            @if ($review === null || $review->is_deleted)
                                <p class="text-slate-500">このレビューは削除されました。</p>
                            @elseif ($review->is_hidden)
                                <p class="text-slate-500">このレビューは非表示になっています。</p>
                            @else
                                <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                                    <a href="{{ route('Game.TitleReview', ['titleKey' => $review->gameTitle->key, 'reviewKey' => $review->key]) }}" class="font-semibold text-slate-100 hover:text-sky-400">{{ $review->gameTitle->name }}</a>
                                    <span class="text-slate-400 text-xs">{{ $review->user->name }} のレビュー</span>
                                    @if ($review->total_score !== null)
                                        <span class="text-slate-300">{{ $review->total_score }}<span class="text-slate-500 text-xs"> / 100</span></span>
                                    @endif
                                </div>
                                @if ($like->review_log_id !== null && $like->review_log_id !== $review->current_log_id)
                                    <p class="text-amber-400 text-xs mt-1">いいねした後に内容が更新されています。</p>
                                @endif
                                <p class="text-slate-500 text-xs mt-1">{{ $like->created_at?->format('Y-m-d') }}</p>
                            @endif
                        </div>
                    @endforeach
                </div>
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

@endsection
