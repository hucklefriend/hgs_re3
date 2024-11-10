@extends('layout')

@section('title', '503-service-unavailable.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1 fade">
                503 Service Unavailable
            </h1>
        </div>


        <div class="node node-center">
            <div class="text-node fade">
                リクエストを処理できませんでした。<br>
                しばらく待って再度アクセスしてください。
            </div>
        </div>
    </div>

    @include('footer')
@endsection
