@extends('layout')

@section('title', 'ミュート中')
@section('current-node-title', 'ミュート中')

@section('current-node-content')
    @if ($muting->isEmpty())
        <p>ミュートしているユーザーはいないようだ。</p>
    @endif
@endsection

@section('nodes')
    @if ($muting->isNotEmpty())
        <section class="node" id="muting-list-node">
            <div class="node-head">
                <h2 class="node-head-text">ミュート中</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <div class="space-y-2">
                    @foreach ($muting as $u)
                        <div class="flex items-center gap-3 border border-slate-700 rounded p-2">
                            <x-user-avatar :user="$u" class="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
                            <div class="min-w-0 flex-1">
                                <a href="{{ route('User.Profile.Show', $u->show_id) }}"
                                   class="font-semibold text-slate-100 hover:text-sky-400 block truncate"
                                  >{{ $u->name }}</a>
                                <span class="text-slate-500 text-xs">@{{ $u->show_id }}</span>
                            </div>
                            <button type="button"
                                    class="js-mute-toggle btn btn-sm btn-outline flex-shrink-0"
                                    data-show-id="{{ $u->show_id }}"
                                    data-active="1"
                                    data-label-on="ミュート解除"
                                    data-label-off="ミュートする"
                                    data-url-on="{{ route('api.users.unmute', $u->show_id) }}"
                                    data-url-off="{{ route('api.users.mute', $u->show_id) }}"
                                    data-method-on="DELETE"
                                    data-method-off="POST"
                                    data-reload="1">
                                ミュート解除
                            </button>
                        </div>
                    @endforeach
                </div>
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">近道</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node basic" id="shortcut-root-node">
                <div class="node-head">
                    <a href="{{ route('Root') }}" class="node-head-text">ルート</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
            </section>
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('User.MyNode.Top') }}" class="node-head-text">マイノード</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
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
            <section class="node basic" id="logout-link-node">
                <div class="node-head">
                    <a href="{{ route('Account.Logout') }}" class="node-head-text">ログアウト</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
        </div>
    </section>
@endsection
