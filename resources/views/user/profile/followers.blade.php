@extends('layout')

@section('title', $profileUser->name . ' のフォロワー')
@section('current-node-title', $profileUser->name . ' のフォロワー')

@section('current-node-content')
    <p class="text-sm text-slate-400">
        <a href="{{ route('User.Profile.Show', $profileUser->show_id) }}" class="hover:text-sky-400" data-hgn-scope="full">← {{ $profileUser->name }} のプロフィール</a>
    </p>
    <div class="mt-2 flex gap-4 text-sm text-slate-300">
        <a href="{{ route('User.Profile.Following', $profileUser->show_id) }}" class="hover:text-sky-400" data-hgn-scope="full">フォロー: <strong>{{ $followingCount }}</strong>人</a>
        <span>フォロワー: <strong>{{ $followerCount }}</strong>人</span>
    </div>
    @if (!$me)
        <p class="mt-3 text-slate-400 text-sm">一覧を表示するにはログインが必要です。</p>
    @elseif ($isBlocked)
        <p class="mt-3 text-slate-400">このユーザーのコンテンツは表示できません。</p>
    @elseif ($followers && $followers->isEmpty())
        <p class="mt-3">フォロワーはいません。</p>
    @endif
@endsection

@section('nodes')
    @if ($me && !$isBlocked && $followers && $followers->isNotEmpty())
        <section class="node" id="followers-list-node">
            <div class="node-head">
                <h2 class="node-head-text">フォロワー</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <div class="space-y-2">
                    @foreach ($followers as $u)
                        @include('user.profile._user_row', [
                            'u'             => $u,
                            'me'            => $me,
                            'myFollowingIds'=> $myFollowingIds,
                        ])
                    @endforeach
                </div>
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

    @include('common.shortcut')
@endsection
