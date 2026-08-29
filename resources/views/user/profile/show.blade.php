@extends('layout')

@section('title', 'ユーザープロフィール')
@section('current-node-title', 'ユーザープロフィール')

@section('current-node-content')
    <div class="flex items-start gap-4 mt-3">
        <x-user-avatar :user="$profileUser" class="w-20 h-20 rounded-full object-cover flex-shrink-0"/>
        <div class="min-w-0">
            <div class="text-xl font-bold text-slate-100 break-all">{{ $profileUser->name }}</div>
            <div class="text-slate-400 text-sm">{{ '@' . $profileUser->show_id }}</div>
        </div>
    </div>

    @if ($isBlocked)
        <p class="mt-4 text-slate-400">ブロック中のようだ。</p>
    @else
        @if ($profileUser->bio)
            <p class="mt-4 text-slate-300 text-sm whitespace-pre-wrap break-all">{{ $profileUser->bio }}</p>
        @endif

        @if (!$isSelf && Auth::check())
            <div class="mt-4 flex items-center gap-2">
                <button type="button"
                        class="js-follow-toggle btn btn-sm {{ $isFollowing ? 'btn-secondary' : 'btn-primary' }}"
                        data-show-id="{{ $profileUser->show_id }}"
                        data-active="{{ $isFollowing ? '1' : '0' }}"
                        data-label-on="フォロー解除"
                        data-label-off="フォローする"
                        data-url-on="{{ route('api.users.unfollow', $profileUser->show_id) }}"
                        data-url-off="{{ route('api.users.follow', $profileUser->show_id) }}"
                        data-method-on="DELETE"
                        data-method-off="POST">
                    {{ $isFollowing ? 'フォロー解除' : 'フォローする' }}
                </button>
                <div class="ml-auto flex gap-2">
                    <button type="button"
                            class="js-mute-toggle btn btn-sm btn-default"
                            title="{{ $isMuting ? 'ミュート解除' : 'ミュートする' }}"
                            data-show-id="{{ $profileUser->show_id }}"
                            data-active="{{ $isMuting ? '1' : '0' }}"
                            data-label-on="ミュート解除"
                            data-label-off="ミュートする"
                            data-icon-on="bi bi-bell-slash-fill"
                            data-icon-off="bi bi-bell-slash"
                            data-url-on="{{ route('api.users.unmute', $profileUser->show_id) }}"
                            data-url-off="{{ route('api.users.mute', $profileUser->show_id) }}"
                            data-method-on="DELETE"
                            data-method-off="POST">
                        <i class="bi {{ $isMuting ? 'bi-bell-slash-fill' : 'bi-bell-slash' }}"></i>
                    </button>
                    <button type="button"
                            class="js-block-toggle btn btn-sm btn-warning"
                            title="{{ $isBlocking ? 'ブロック解除' : 'ブロックする' }}"
                            data-show-id="{{ $profileUser->show_id }}"
                            data-active="{{ $isBlocking ? '1' : '0' }}"
                            data-label-on="ブロック解除"
                            data-label-off="ブロックする"
                            data-icon-on="bi bi-slash-circle-fill"
                            data-icon-off="bi bi-slash-circle"
                            data-url-on="{{ route('api.users.unblock', $profileUser->show_id) }}"
                            data-url-off="{{ route('api.users.block', $profileUser->show_id) }}"
                            data-method-on="DELETE"
                            data-method-off="POST"
                            data-reload="1">
                        <i class="bi {{ $isBlocking ? 'bi-slash-circle-fill' : 'bi-slash-circle' }}"></i>
                    </button>
                </div>
            </div>
        @endif

        <div class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
            <div>
                怖さメーター: <a href="{{ route('User.Profile.FearMeters', $profileUser->show_id) }}" class="font-semibold hover:text-sky-400">{{ $fearMeterCount }}件</a>
            </div>
            <div>
                レビュー: <a href="{{ route('User.Profile.Reviews', $profileUser->show_id) }}" class="font-semibold hover:text-sky-400">{{ $reviewCount }}件</a>
            </div>
            <div>
                フォロー: <a href="{{ route('User.Profile.Following', $profileUser->show_id) }}" class="font-semibold hover:text-sky-400">{{ $followingCount }}人</a>
            </div>
            <div>
                フォロワー: <a href="{{ route('User.Profile.Followers', $profileUser->show_id) }}" class="font-semibold hover:text-sky-400">{{ $followerCount }}人</a>
            </div>
        </div>
    @endif
@endsection

@section('nodes')
    @if (!$isBlocked && $favoriteTitles->isNotEmpty())
        <section class="node tree-node" id="profile-favorite-titles-node">
            <div class="node-head">
                <h2 class="node-head-text">お気に入りタイトル</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @foreach ($favoriteTitles as $title)
                    <section class="node basic">
                        <div class="node-head">
                            <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" class="node-head-text">{{ $title->name }}</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                @endforeach
            </div>
        </section>
    @endif

    @if (!$isBlocked && count($recentActivity) > 0)
        <section class="node tree-node" id="profile-activity-node">
            <div class="node-head">
                <x-site.timeline-heading title="最近の活動" title-class="node-head-text" />
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @foreach ($recentActivity as $event)
                    @include('common.timeline_event', ['event' => $event])
                @endforeach
                <section class="node basic">
                    <div class="node-head">
                        <a href="{{ route('User.Profile.Timeline', $profileUser->show_id) }}" class="node-head-text">活動タイムラインをすべて見る</a>
                        <span class="node-pt">●</span>
                    </div>
                </section>
            </div>
        </section>
    @endif

@endsection
