@extends('layout')

@section('title', 'マイノード')
@section('current-node-title', 'マイノード')

@section('current-node-content')

@if ($needsAcceptance)
<div class="alert alert-warning mt-3">
    <p>
        <a href="{{ route('PrivacyPolicy') }}">プライバシーポリシー</a>が改定されています。<br>
        <a href="{{ route('PrivacyPolicy') }}">プライバシーポリシー</a>にて内容を確認し「同意」の実行をお願いします。
    </p>
</div>
@endif
@if ($recoveryCodeRemaining !== null && $recoveryCodeRemaining <= 3)
<div class="alert alert-warning mt-3">
    <p>
        2段階認証のリカバリーコードの残りが<strong>{{ $recoveryCodeRemaining }}個</strong>になっています。<br>
        <a href="{{ route('User.MyNode.LoginSettings') }}">ログイン設定</a>からリカバリーコードを再発行してください。
    </p>
</div>
@endif
@if (session('success'))
<div class="alert alert-success mt-3">
    {{ session('success') }}
</div>
@endif

<div id="mypage-welcome-node">
    <div class="ml-3">
        <div class="flex items-center gap-4 mb-2">
            <x-user-avatar :user="$user" class="w-16 h-16 rounded-full object-cover flex-shrink-0"/>
            <div>
                <p class="font-bold text-lg leading-tight">{{ $user->name }}</p>
                <p class="text-slate-500 text-sm">{{ '@' . $user->show_id }}</p>
            </div>
        </div>
        @if ($user->bio)
        <p class="text-sm whitespace-pre-wrap mb-2">{{ $user->bio }}</p>
        @endif
    </div>

    <nav class="my-node-quick-menu" aria-label="マイノードメニュー">
        <section class="my-node-quick-menu__group" id="user-social-tree-node" aria-labelledby="user-social-menu-title">
            <header>
                <p>USER NODE</p>
                <h2 id="user-social-menu-title">ユーザー</h2>
            </header>
            <div class="my-node-quick-menu__links">
                <a href="{{ route('User.MyNode.Following') }}" class="has-site-connection-terminal"><span class="site-connection-label my-node-quick-menu__label">フォロー中 <span class="my-node-quick-menu__count">({{ $followingCount }})</span><x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.Followers') }}" class="has-site-connection-terminal"><span class="site-connection-label my-node-quick-menu__label">フォロワー <span class="my-node-quick-menu__count">({{ $followerCount }})</span><x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.Blocking') }}" class="has-site-connection-terminal"><span class="site-connection-label my-node-quick-menu__label">ブロック中 <span class="my-node-quick-menu__count">({{ $blockingCount }})</span><x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.Muting') }}" class="has-site-connection-terminal"><span class="site-connection-label my-node-quick-menu__label">ミュート中 <span class="my-node-quick-menu__count">({{ $mutingCount }})</span><x-site.connection-terminal /></span></a>
            </div>
        </section>
        <section class="my-node-quick-menu__group" id="user-data-tree-node" aria-labelledby="user-game-menu-title">
            <header>
                <p>GAME NODE</p>
                <h2 id="user-game-menu-title">ゲーム</h2>
            </header>
            <div class="my-node-quick-menu__links">
                <a href="{{ route('User.Follow.FavoriteTitles') }}" class="has-site-connection-terminal" id="user-favorite-title-link-node"><span class="site-connection-label my-node-quick-menu__label">お気に入りタイトル <span class="my-node-quick-menu__count">({{ $favoriteTitleCount }})</span><x-site.connection-terminal /></span></a>
                <a href="{{ route('User.FearMeter.Index') }}" class="has-site-connection-terminal" id="user-fear-meter-index-link-node"><span class="site-connection-label my-node-quick-menu__label">怖さメーター <span class="my-node-quick-menu__count">({{ $fearMeterCount }})</span><x-site.connection-terminal /></span></a>
                <a href="{{ route('User.Review.Index') }}" class="has-site-connection-terminal" id="user-review-index-link-node"><span class="site-connection-label my-node-quick-menu__label">レビュー <span class="my-node-quick-menu__count">({{ $reviewCount }})</span><x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.ReviewLikes') }}" class="has-site-connection-terminal" id="user-review-likes-link-node"><span class="site-connection-label my-node-quick-menu__label">いいねしたレビュー <span class="my-node-quick-menu__count">({{ $reviewLikeCount }})</span><x-site.connection-terminal /></span></a>
            </div>
        </section>
        <section class="my-node-quick-menu__group" id="mypage-settings-node" aria-labelledby="mypage-settings-title">
            <header>
                <p>CONTROL NODE</p>
                <h2 id="mypage-settings-title">設定・管理</h2>
            </header>
            <div class="my-node-quick-menu__links" id="user-tree-node">
                <a href="{{ route('User.MyNode.TimelineSettings') }}" class="has-site-connection-terminal" id="timeline-settings-link-node"><span class="site-connection-label my-node-quick-menu__label">タイムライン設定<x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.Profile') }}" class="has-site-connection-terminal" id="user-account-profile-edit-link-node"><span class="site-connection-label my-node-quick-menu__label">プロフィール設定<x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.Email') }}" class="has-site-connection-terminal" id="user-account-email-change-link-node"><span class="site-connection-label my-node-quick-menu__label">メールアドレス変更<x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.Password') }}" class="has-site-connection-terminal" id="user-account-password-change-link-node"><span class="site-connection-label my-node-quick-menu__label">パスワード変更<x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.LoginSettings') }}" class="has-site-connection-terminal" id="user-account-login-settings-link-node"><span class="site-connection-label my-node-quick-menu__label">ログイン設定<x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.SocialAccounts') }}" class="has-site-connection-terminal" id="user-account-social-accounts-link-node"><span class="site-connection-label my-node-quick-menu__label">外部サービス連携<x-site.connection-terminal /></span></a>
                <a href="{{ route('User.MyNode.Withdraw') }}" class="has-site-connection-terminal" id="user-account-withdraw-link-node"><span class="site-connection-label my-node-quick-menu__label">退会<x-site.connection-terminal /></span></a>
            </div>
        </section>
        @empty($user->email)
            <div class="my-node-menu__notice">
                <p class="alert alert-warning">
                    メールアドレスが設定されていないようだ。<br>
                    SNSでログインできなくなった時のために設定しておいた方がいいだろう。
                </p>
            </div>
        @endempty
    </nav>
</div>

@endsection

@section('nodes')

    <section class="lineup-franchise my-node-timeline" id="timeline-node">
        <header>
            <x-site.timeline-heading title="新着情報" />
        </header>
        <div class="home-transmission-list">
            @forelse ($timelineEvents as $event)
                @include('common.transmission_row', ['event' => $event, 'index' => $loop->iteration])
            @empty
                <p class="site-empty-state">新しい通信は、まだ届いていないようだ。</p>
            @endforelse
            <div class="home-all-signals">
                <a href="{{ route('User.MyNode.Timeline') }}">更新情報を見る</a>
            </div>
        </div>
    </section>
@endsection
