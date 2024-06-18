@extends('layout')

@section('title', '500-internal-server-error.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">
                500 Internal Server Error
            </h1>
        </div>


        <div class="node node-center">
            <div class="text-node">
                エラーが発生しました。<br>
                申し訳ありません、不具合があったため処理を実行できませんでした。<br>
                対処されるまでお待ちください。
            </div>
        </div>
    </div>

    @include('footer')
@endsection
