@extends('layout')

@section('title', 'メール確認')
@section('current-node-title', 'メール確認')

@section('nodes')

    <section class="node" id="verify-email-pending-node">
        <div class="node-head">
            <h2 class="node-head-text">メールを送信しました</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <div class="alert alert-info">
                <p>
                    メールアドレスの確認メールを送信しました。<br>
                    10分以内にメール内のリンクをクリックしてください。<br>
                    メールが届かない場合は、迷惑メールフォルダをご確認ください。
                </p>
            </div>
        </div>
    </section>

    @include('common.shortcut')
@endsection

