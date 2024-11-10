@extends('layout')

@section('title', '401-unauthorized.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1 fade">
                401 Unauthorized
            </h1>
        </div>


        <div class="node node-center">
            <div class="text-node fade">
                指定のネットワークまたはノードへのアクセスはできません。
            </div>
        </div>
    </div>

    @include('footer')
@endsection
