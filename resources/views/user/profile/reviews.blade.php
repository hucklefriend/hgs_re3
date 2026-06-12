@extends('layout')

@section('title', $profileUser->name . ' のレビュー')
@section('current-node-title', $profileUser->name . ' のレビュー')

@section('current-node-content')
    <p class="text-sm text-slate-400">
        <a href="{{ route('User.Profile.Show', $profileUser->show_id) }}" class="hover:text-sky-400" data-hgn-scope="full">← {{ $profileUser->name }} のプロフィール</a>
    </p>
    @if ($isBlocked)
        <p class="mt-3 text-slate-400">このユーザーのコンテンツは表示できません。</p>
    @elseif ($reviews->isEmpty())
        <p class="mt-3">まだレビューはありません。</p>
    @endif
@endsection

@section('nodes')
    @if (!$isBlocked && $reviews->isNotEmpty())
        <section class="node" id="reviews-list-node">
            <div class="node-head">
                <h2 class="node-head-text">レビュー一覧</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <div class="space-y-3">
                    @foreach ($reviews as $review)
                        <div class="border border-slate-600 rounded p-3 text-sm">
                            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <a href="{{ route('Game.TitleReview', ['titleKey' => $review->gameTitle->key, 'reviewKey' => $review->key]) }}"
                                   class="font-semibold text-slate-100 hover:text-sky-400"
                                   data-hgn-scope="full">{{ $review->gameTitle->name }}</a>
                                @if ($review->total_score !== null)
                                    <span class="text-slate-300">{{ $review->total_score }}<span class="text-slate-500 text-xs"> / 100</span></span>
                                @endif
                                @if ($review->has_spoiler)
                                    <span class="text-amber-400 text-xs">ネタバレあり</span>
                                @endif
                            </div>
                            <p class="text-slate-500 text-xs mt-1">{{ $review->updated_at?->format('Y-m-d') }}</p>
                        </div>
                    @endforeach
                </div>
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

    @include('common.shortcut')
@endsection
