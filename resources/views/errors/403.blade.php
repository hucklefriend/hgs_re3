@extends('layout')

@section('title', '401-forbidden.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">
                403 Forbidden
            </h1>
        </div>


        <div class="node node-center">
            <div class="text-node">
                指定のネットワークまたはノードへアクセスする権限がありません。
            </div>
        </div>
    </div>

    @include('footer')
@endsection
