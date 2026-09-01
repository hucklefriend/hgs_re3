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
                        <button type="button"
                                class="js-follow-toggle btn btn-sm btn-warning following-user-unfollow"
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
            <div class="following-user-list__pager">
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

@endsection
