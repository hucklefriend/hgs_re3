@extends('layout')

@section('title', '405 Method Not Allowed')
@section('current-node-title', '405 Method Not Allowed')

@section('nodes')
    <section class="node">
        <div class="node-head">
            <h2 class="node-head-text">許可されていないリクエスト</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                そのリクエストは許可されていないようだ。
            </p>
        </div>
    </section>

@endsection
