@extends('layout')

@section('title', 'タイムライン設定')
@section('current-node-title', 'タイムライン設定')

@section('nodes')
    <section class="node" id="timeline-settings-mynode-node">
        <div class="node-head">
            <h2 class="node-head-text">マイノードタイムラインに表示するもの</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">

            @if(session('success'))
                <div class="alert alert-success mt-3">
                    {{ session('success') }}
                </div>
            @endif

            <form action="{{ route('User.MyNode.TimelineSettings.UpdateMyNode') }}" method="POST">
                @csrf

                <div class="form-group mb-2">
                    <label class="d-flex align-items-center gap-2">
                        <input type="checkbox" name="show_horror_keyword_rss" value="1"
                            @checked(old('show_horror_keyword_rss', $setting->show_horror_keyword_rss))>
                        「ホラー」キーワードでマッチしたメディア記事
                    </label>
                </div>

                <div class="form-group mb-2">
                    <label class="d-flex align-items-center gap-2">
                        <input type="checkbox" name="show_favorite_franchise_rss" value="1"
                            @checked(old('show_favorite_franchise_rss', $setting->show_favorite_franchise_rss))>
                        お気に入りタイトルにマッチしたメディア記事
                    </label>
                </div>

                <div class="form-group mb-4">
                    <label class="d-flex align-items-center gap-2">
                        <input type="checkbox" name="show_followed_user_activity" value="1"
                            @checked(old('show_followed_user_activity', $setting->show_followed_user_activity))>
                        フォロー中ユーザーの活動
                    </label>
                </div>

                <div class="form-group">
                    <button type="submit" class="btn btn-success">設定</button>
                </div>
            </form>
        </div>
    </section>

    <section class="node" id="timeline-settings-root-node">
        <div class="node-head">
            <h2 class="node-head-text">ルートタイムラインに表示してもいいですか？</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <form action="{{ route('User.MyNode.TimelineSettings.UpdateRoot') }}" method="POST">
                @csrf

                <div class="form-group mb-4">
                    <label class="d-flex align-items-center gap-2">
                        <input type="checkbox" name="publish_activity_to_root" value="1"
                            @checked(old('publish_activity_to_root', $setting->publish_activity_to_root))>
                        あなたの活動
                    </label>
                </div>

                <div class="form-group">
                    <button type="submit" class="btn btn-success">設定</button>
                </div>
            </form>
        </div>
    </section>

    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">近道</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('Root') }}" class="node-head-text">ルート</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('User.MyNode.Top') }}" class="node-head-text">マイノード</a>
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
