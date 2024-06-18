@extends('layout')

@section('title', '502-bad-gateway.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">
                502 Bad Gateway
            </h1>
        </div>

        <div class="node node-center">
            <div class="text-node">
                不正な応答を受信したため、処理を実行できませんでした。<br>
                やり直しても問題が解決しない場合はお問い合わせください。<br>
                問い合わせ先はAboutノードを確認してください。
            </div>
        </div>
    </div>

    @include('footer')
@endsection
