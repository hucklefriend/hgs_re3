@extends('layout')

@section('title', 'フォロー中')
@section('current-node-title', 'フォロー中ユーザーリスト')

@section('current-node-content')
    @if ($following->isEmpty())
        <p>フォロー中ユーザーはいないようだ。</p>
    @endif
@endsection

@section('nodes')
    @if ($following->isNotEmpty())
        <section class="node" id="following-list-node">
            <div class="node-head">
                <h2 class="node-head-text">ユーザーリスト</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <div class="space-y-2">
                    @foreach ($following as $u)
                        <div class="flex items-center gap-3 border border-slate-700 rounded p-2">
                            <x-user-avatar :user="$u" class="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
                            <div class="min-w-0 flex-1">
                                <a href="{{ route('User.Profile.Show', $u->show_id) }}"
                                   class="font-semibold text-slate-100 hover:text-sky-400 block truncate"
                                  >{{ $u->name }}</a>
                                <span class="text-slate-500 text-xs">{{ '@' . $u->show_id }}</span>
                            </div>
                            <button type="button"
                                    class="js-follow-toggle btn btn-sm btn-warning flex-shrink-0"
                                    data-show-id="{{ $u->show_id }}"
                                    data-active="1"
                                    data-label-on="フォロー解除"
                                    data-label-off="フォローする"
                                    data-url-on="{{ route('api.users.unfollow', $u->show_id) }}"
                                    data-url-off="{{ route('api.users.follow', $u->show_id) }}"
                                    data-method-on="DELETE"
                                    data-method-off="POST"
                                    data-reload="1">
                                解除
                            </button>
                        </div>
                    @endforeach
                </div>
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

@endsection
