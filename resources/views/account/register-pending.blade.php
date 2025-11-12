@extends('layout')

@section('title', '仮登録を受け付けました')
@section('current-node-title', '仮登録を受け付けました')

@section('nodes')
    <section class="node" id="register-pending-node">
        <div class="node-head">
            <h2 class="node-head-text">メールを送信しました</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <div class="alert alert-info">
                <p>
                    登録用ページのURLを記載したメールを送信しました。<br>
                    1時間以内に登録用ページのURLをクリックして、必要事項を入力して登録を完了してください。<br>
                    メールが届かない場合は、迷惑メールフォルダをご確認ください。
                </p>
            </div>
        </div>
    </section>

    @include('common.shortcut')
@endsection

