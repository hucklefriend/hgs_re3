@extends('layout')

@section('title', '503 Service Unavailable')
@section('current-node-title', '503 Service Unavailable')

@section('nodes')
    <section class="node">
        <div class="node-head">
            <h2 class="node-head-text">サービス利用不可</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                サービスが一時的に利用できません。<br>
                メンテナンス中か、サーバーの負荷が高い可能性があります。<br>
                <br>
                申し訳ありませんが、しばらく待って再度アクセスしてください。
            </p>
        </div>
    </section>

    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">近道</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Root') }}" class="node-head-text">トップ</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
            </section>
        </div>
    </section>
@endsection
