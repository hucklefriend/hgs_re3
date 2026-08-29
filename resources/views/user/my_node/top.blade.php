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

<div class="mt-4 ml-3" id="mypage-welcome-node">
    <p class="site-eyebrow">ようこそ</p>
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
    <p class="text-sm">
        <a href="{{ route('User.MyNode.Following') }}" class="hover:underline">フォロー {{ $followingCount }}人</a>
        <span class="mx-2 text-slate-400">|</span>
        <a href="{{ route('User.MyNode.Followers') }}" class="hover:underline">フォロワー {{ $followerCount }}人</a>
    </p>
</div>

@endsection

@section('nodes')

    <section class="node tree-node" id="timeline-node">
        <div class="node-head">
            <x-site.timeline-heading title="新着情報" title-class="node-head-text" />
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            @forelse ($timelineEvents as $event)
                @include('common.timeline_event', ['event' => $event])
            @empty
                <section class="node basic">
                    <div class="node-content basic">
                        <p>更新情報はないようだ。</p>
                    </div>
                </section>
            @endforelse
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('User.MyNode.Timeline') }}" class="node-head-text">更新情報を見る</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
        </div>
    </section>
    <section class="node tree-node" id="user-social-tree-node">
        <div class="node-head">
            <h3 class="node-head-text">ユーザー</h3>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('User.MyNode.Following') }}" class="node-head-text">フォロー中</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('User.MyNode.Followers') }}" class="node-head-text">フォロワー</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('User.MyNode.Blocking') }}" class="node-head-text">ブロック中</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('User.MyNode.Muting') }}" class="node-head-text">ミュート中</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
        </div>
    </section>
    <section class="node tree-node" id="user-data-tree-node">
        <div class="node-head">
            <h3 class="node-head-text">ゲーム</h3>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node basic" id="user-favorite-title-link-node">
                <div class="node-head">
                    <a href="{{ route('User.Follow.FavoriteTitles') }}" class="node-head-text">お気に入りタイトル</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            <section class="node tree-node" id="user-review-tree-node">
                <div class="node-head">
                    <h3 class="node-head-text">レビュー</h3>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content tree">
                    <section class="node basic" id="user-review-index-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.Review.Index') }}" class="node-head-text">レビュー</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                    <section class="node basic" id="user-review-likes-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.ReviewLikes') }}" class="node-head-text">いいねしたレビュー</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                    <section class="node basic" id="user-fear-meter-index-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.FearMeter.Index') }}" class="node-head-text">怖さメーター</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    </section>
    <section class="node tree-node" id="mypage-settings-node">
        <div class="node-head">
            <h2 class="node-head-text">設定・管理</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree" id="user-tree-node">

            <section class="node basic" id="timeline-settings-link-node">
                <div class="node-head">
                    <a href="{{ route('User.MyNode.TimelineSettings') }}" class="node-head-text">タイムライン設定</a>
                    <span class="node-pt">●</span>
                </div>
            </section>

            <section class="node tree-node" id="user-account-tree-node">
                <div class="node-head">
                    <h3 class="node-head-text">アカウント</h3>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content tree">
                    <section class="node basic" id="user-account-profile-edit-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.Profile') }}" class="node-head-text">プロフィール設定</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                    <section class="node basic" id="user-account-email-change-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.Email') }}" class="node-head-text">メールアドレス変更</a>
                            <span class="node-pt">●</span>
                        </div>
                        @empty($user->email)
                        <div class="node-content basic">
                            <p class="alert alert-warning">
                                メールアドレスが設定されていないようだ。<br>
                                SNSでログインできなくなった時のために設定しておいた方がいいだろう。
                            </p>
                        </div>
                        @endempty
                    </section>
                    <section class="node basic" id="user-account-password-change-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.Password') }}" class="node-head-text">パスワード変更</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                    <section class="node basic" id="user-account-login-settings-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.LoginSettings') }}" class="node-head-text">ログイン設定</a>
                            <span class="node-pt">●</span>
                        </div>
                        <div class="node-content basic">
                            <ul>
                                <li>2段階認証の設定</li>
                                <li>リカバリーコードの再発行</li>
                            </ul>
                        </div>
                    </section>
                    <section class="node basic" id="user-account-social-accounts-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.SocialAccounts') }}" class="node-head-text">外部サービス連携</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                    <section class="node basic" id="user-account-withdraw-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.Withdraw') }}" class="node-head-text">退会</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    </section>

@endsection
