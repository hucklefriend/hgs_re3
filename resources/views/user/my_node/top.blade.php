@extends('layout')

@section('title', 'マイページ')
@section('current-node-title', 'マイページ')

@section('nodes')
    <section class="node tree-node" id="mypage-welcome-node">
        <div class="node-head">
            <h2 class="node-head-text">ようこそ</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic" id="user-account-setting-basic-node">
            @if (session('success'))
                <div class="alert alert-success mt-3">
                    {{ session('success') }}
                </div>
            @endif
            <p>{{ $user->name }}さんようこそ</p>
        </div>
        <div class="node-content tree" id="user-account-setting-tree-node">
            <section class="node tree-node" id="media-mix-tree-node">
                <div class="node-head">
                    <h3 class="node-head-text">アカウント</h3>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content tree">
                    <section class="node link-node" id="user-account-email-change-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.Email') }}" class="node-head-text">メールアドレス変更</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                    <section class="node link-node" id="user-account-password-change-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.Password') }}" class="node-head-text">パスワード変更</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                    <section class="node link-node" id="user-account-withdraw-link-node">
                        <div class="node-head">
                            <a href="{{ route('User.MyNode.Withdraw') }}" class="node-head-text">退会</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    </section>

    @include('common.shortcut')
@endsection

