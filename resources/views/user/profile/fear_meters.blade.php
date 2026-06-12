@extends('layout')

@section('title', $profileUser->name . ' の怖さメーター')
@section('current-node-title', $profileUser->name . ' の怖さメーター')

@section('current-node-content')
    <p class="text-sm text-slate-400">
        <a href="{{ route('User.Profile.Show', $profileUser->show_id) }}" class="hover:text-sky-400" data-hgn-scope="full">← {{ $profileUser->name }} のプロフィール</a>
    </p>
    @if ($isBlocked)
        <p class="mt-3 text-slate-400">このユーザーのコンテンツは表示できません。</p>
    @elseif ($fearMeters->isEmpty())
        <p class="mt-3">まだ怖さメーターの評価はありません。</p>
    @endif
@endsection

@section('nodes')
    @if (!$isBlocked && $fearMeters->isNotEmpty())
        <section class="node" id="fear-meters-list-node">
            <div class="node-head">
                <h2 class="node-head-text">怖さメーター一覧</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <div class="space-y-2">
                    @foreach ($fearMeters as $fm)
                        <div class="border border-slate-600 rounded p-3 text-sm flex items-center justify-between gap-3">
                            <a href="{{ route('Game.TitleDetail', ['titleKey' => $fm->gameTitle->key]) }}"
                               class="text-slate-100 hover:text-sky-400 min-w-0 break-all"
                               data-hgn-scope="full">{{ $fm->gameTitle->name }}</a>
                            <span class="text-slate-300 flex-shrink-0">{{ $fm->fear_meter->value }} / 4</span>
                        </div>
                    @endforeach
                </div>
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

    @include('common.shortcut')
@endsection
