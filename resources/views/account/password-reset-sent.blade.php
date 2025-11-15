@extends('layout')

@section('title', 'メールを送信しました')
@section('current-node-title', 'メールを送信しました')

@section('nodes')
    <section class="node" id="password-reset-sent-node">
        <div class="node-head">
            <h2 class="node-head-text">メールを送信しました</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <div class="alert alert-info">
                <p>
                    パスワードリセット用のリンクを記載したメールを送信しました。<br>
                    15分以内にメール内のリンクをクリックして、新しいパスワードを設定してください。<br>
                    メールが届かない場合は、迷惑メールフォルダをご確認ください。
                </p>
            </div>
        </div>
    </section>

    @include('common.shortcut')
@endsection

