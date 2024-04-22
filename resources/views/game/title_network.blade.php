@extends('layout')

@section('content')
    <div class="node-list">
        <div class="link-node">
            <a href="{{ route('HGN') }}"><i class="icon-arrow-left"></i></a>
        </div>
        <div class="node node-center">
            <div id="title-node" style="margin-top: 30px;">
                <h1>{{ $title->name }}</h1>
            </div>
        </div>

        <div>
            ゲーム情報
        </div>

        <div>
            タグ
        </div>

        <div>
            レビュー
        </div>

        <div>
            攻略
        </div>

        <div>
            日記
        </div>

        <div>
            辞書
        </div>

        <div>
            二次創作
        </div>

    </div>


@endsection
