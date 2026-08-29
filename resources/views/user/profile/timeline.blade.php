@extends('layout')

@section('title', $profileUser->name . ' の活動タイムライン')
@section('current-node-title', $profileUser->name . ' の活動タイムライン')

@section('current-node-content')
    <p class="text-sm text-slate-400">
        <a href="{{ route('User.Profile.Show', $profileUser->show_id) }}" class="hover:text-sky-400">← {{ $profileUser->name }} のプロフィール</a>
    </p>
    @if ($isBlocked)
        <p class="mt-3 text-slate-400">このユーザーのコンテンツは表示できません。</p>
    @elseif ($paginator->isEmpty())
        <p class="mt-3">ここには、まだ活動の痕跡はないようだ。</p>
    @endif
@endsection

@section('nodes')
    @if (!$isBlocked && !$paginator->isEmpty())
        @foreach ($paginator as $event)
            @include('common.timeline_event', ['event' => $event])
        @endforeach

        @include('common.pager', ['pager' => $pager])
    @endif

@endsection
