@extends('layout')

@section('title', $profileUser->name . ' のフォロー')
@section('current-node-title', $profileUser->name . ' のフォロー')

@section('current-node-content')
    <p class="text-sm text-slate-400">
        <a href="{{ route('User.Profile.Show', $profileUser->show_id) }}" class="hover:text-sky-400">← {{ $profileUser->name }} のプロフィール</a>
    </p>
    <div class="mt-2 flex gap-4 text-sm text-slate-300">
        <span>フォロー: <strong>{{ $followingCount }}</strong>人</span>
        <a href="{{ route('User.Profile.Followers', $profileUser->show_id) }}" class="hover:text-sky-400">フォロワー: <strong>{{ $followerCount }}</strong>人</a>
    </div>
    @if (!$me)
        <p class="mt-3 text-slate-400 text-sm">一覧を表示するにはログインが必要です。</p>
    @elseif ($isBlocked)
        <p class="mt-3 text-slate-400">このユーザーのコンテンツは表示できません。</p>
    @elseif ($following && $following->isEmpty())
        <p class="mt-3">フォローしているユーザーはいません。</p>
    @endif
@endsection

@section('nodes')
    @if ($me && !$isBlocked && $following && $following->isNotEmpty())
        <section class="node" id="following-list-node">
            <div class="node-head">
                <h2 class="node-head-text">フォロー中</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <div class="space-y-2">
                    @foreach ($following as $u)
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
