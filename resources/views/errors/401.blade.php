@extends('layout')

@section('title', '401 Unauthorized')
@section('current-node-title', '401 Unauthorized')

@section('nodes')
    <section class="node">
        <div class="node-head">
            <h2 class="node-head-text">アクセス拒否</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                指定のページへのアクセスはできません。<br>
                認証が必要です。
            </p>
        </div>
    </section>

@endsection
