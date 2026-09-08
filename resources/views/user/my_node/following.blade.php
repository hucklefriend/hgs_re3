@php
    $breadcrumbItems = [
        ['label' => 'MY NODE', 'url' => route('User.MyNode.Top')],
    ];
@endphp

@extends('layout')

@section('title', 'フォロー中')
@section('current-node-title', 'フォロー中')

@section('current-node-content')
    @if ($following->isEmpty())
        <p>フォロー中ユーザーはいないようだ。</p>
    @endif
@endsection

@section('nodes')
    @if ($following->isNotEmpty())
        <section class="lineup-franchise following-user-list" id="following-list-node">
            <header>
                <div><p>USER NODE</p><h2>ユーザーリスト</h2></div>
            </header>
            <div class="following-user-list__entries">
                @foreach ($following as $u)
                    @php
                        $isMutingUser = $mutedUserIds->has($u->id);
                        $actionMenuId = 'following-user-actions-' . $u->id;
                    @endphp
                    <div class="following-user-entry">
                        <a href="{{ route('User.Profile.Show', $u->show_id) }}"
                           class="following-user-link">
                            <span class="lineup-result-signal" aria-hidden="true"></span>
                            <x-user-avatar :user="$u" class="following-user-link__avatar"/>
                            <span class="following-user-link__identity">
                                <strong class="following-user-link__name">{{ $u->name }}</strong>
                                <span class="following-user-link__id">{{ '@' . $u->show_id }}</span>
                            </span>
                            <x-site.connection-terminal />
                        </a>
                        <div class="following-user-action-menu js-user-action-menu">
                            <button type="button"
                                    class="following-user-action-menu__trigger has-site-connection-terminal"
                                    aria-label="{{ $u->name }}の操作メニュー"
                                    aria-haspopup="menu"
                                    aria-expanded="false"
                                    aria-controls="{{ $actionMenuId }}">
                                <span>操作</span>
                                <span class="following-user-action-menu__trigger-mark" aria-hidden="true">+</span>
                                <x-site.connection-terminal />
                            </button>
                            <div class="following-user-action-menu__panel"
                                 id="{{ $actionMenuId }}"
                                 role="menu"
                                 hidden>
                                <a href="{{ route('User.Profile.Show', $u->show_id) }}"
                                   class="following-user-action-menu__item"
                                   data-no-connection-terminal
                                   role="menuitem">
                                    プロフィールを見る
                                </a>
                                <form method="POST" action="{{ route('User.MyNode.Following.Mute', $u->show_id) }}">
                                    @csrf
                                    @if ($isMutingUser)
                                        @method('DELETE')
                                    @endif
                                    <button type="submit"
                                            class="following-user-action-menu__item"
                                            role="menuitem">
                                        {{ $isMutingUser ? 'ミュートを解除' : 'ミュートする' }}
                                    </button>
                                </form>
                                <div class="following-user-action-menu__separator" role="separator"></div>
                                <button type="button"
                                        class="js-follow-toggle following-user-action-menu__item following-user-action-menu__item--warning"
                                        role="menuitem"
                                        data-show-id="{{ $u->show_id }}"
                                        data-active="1"
                                        data-label-on="フォローを解除"
                                        data-label-off="フォローする"
                                        data-url-on="{{ route('api.users.unfollow', $u->show_id) }}"
                                        data-url-off="{{ route('api.users.follow', $u->show_id) }}"
                                        data-method-on="DELETE"
                                        data-method-off="POST"
                                        data-reload="1">
                                    フォローを解除
                                </button>
                                <button type="button"
                                        class="js-block-toggle following-user-action-menu__item following-user-action-menu__item--danger"
                                        role="menuitem"
                                        data-show-id="{{ $u->show_id }}"
                                        data-active="0"
                                        data-label-on="ブロックを解除"
                                        data-label-off="ブロックする"
                                        data-url-on="{{ route('api.users.unblock', $u->show_id) }}"
                                        data-url-off="{{ route('api.users.block', $u->show_id) }}"
                                        data-method-on="DELETE"
                                        data-method-off="POST"
                                        data-confirm="このユーザーをブロックしますか？ お互いのフォローも解除されます。"
                                        data-reload="1">
                                    ブロックする
                                </button>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            <div class="following-user-list__pager">
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

@endsection
