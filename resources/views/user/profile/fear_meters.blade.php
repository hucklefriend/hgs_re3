@extends('layout')

@section('title', $profileUser->name . 'さんの怖さメーター')
@section('current-node-title', $profileUser->name . 'さんの怖さメーター')

@section('current-node-content')
    @if ($isBlocked)
        <p class="mt-3 text-slate-400">このユーザーのコンテンツは表示できません。</p>
    @elseif ($fearMeters->isEmpty())
        <p class="mt-3">まだ怖さメーターの評価はありません。</p>
    @endif
@endsection

@section('nodes')
    @if (!$isBlocked)
        @foreach ($fearMeters as $fm)
            @php $log = $fearMeterComments[$fm->game_title_id] ?? null; @endphp
            <section class="node" id="fear-meter-{{ $fm->game_title_id }}-node">
                <div class="node-head">
                    <span class="node-head-text">
                        <a href="{{ route('Game.TitleDetail', ['titleKey' => $fm->gameTitle->key]) }}" data-hgn-scope="full">{{ $fm->gameTitle->name }}</a>
                    </span>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content basic">
                    <div class="text-sm text-slate-200">
                        {{ $fm->fear_meter->text() }}
                        <span class="text-slate-500 text-xs ml-1">（{{ $fm->fear_meter->value }} / 4）</span>
                    </div>

                    @if ($log?->comment)
                        <p class="mt-1 text-sm text-slate-300">{{ $log->comment }}</p>
                    @endif
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
