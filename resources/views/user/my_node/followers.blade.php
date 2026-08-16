@extends('layout')

@section('title', 'フォロワーリスト')
@section('current-node-title', 'フォロワーリスト')

@section('current-node-content')
    @if ($followers->isEmpty())
        <p>フォロワーはいないようだ。</p>
    @endif
@endsection

@section('nodes')
    @if ($followers->isNotEmpty())
        <section class="node" id="followers-list-node">
            <div class="node-head">
                <h2 class="node-head-text">ユーザーリスト</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <div class="space-y-2">
                    @foreach ($followers as $u)
                        <div class="flex items-center gap-3 border border-slate-700 rounded p-2">
                            <x-user-avatar :user="$u" class="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
                            <div class="min-w-0 flex-1">
                                <a href="{{ route('User.Profile.Show', $u->show_id) }}"
                                   class="font-semibold text-slate-100 hover:text-sky-400 block truncate"
                                  >{{ $u->name }}</a>
                                <span class="text-slate-500 text-xs">{{ '@' . $u->show_id }}</span>
                            </div>
                            <button type="button"
                                    class="js-block-toggle btn btn-sm btn-warning flex-shrink-0"
                                    data-show-id="{{ $u->show_id }}"
                                    data-active="0"
                                    data-label-on="ブロック解除"
                                    data-label-off="ブロックする"
                                    data-url-on="{{ route('api.users.unblock', $u->show_id) }}"
                                    data-url-off="{{ route('api.users.block', $u->show_id) }}"
                                    data-method-on="DELETE"
                                    data-method-off="POST"
                                    data-reload="1">
                                ブロック
                            </button>
                        </div>
                    @endforeach
                </div>
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

@endsection
