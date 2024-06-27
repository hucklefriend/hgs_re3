@extends('layout')

@section('title', '404-not-found.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">
                404 Not Found
            </h1>
        </div>


        <div class="node node-center">
            <div class="text-node">
                指定のネットワークまたはノードは存在しません。
            </div>
        </div>
    </div>

    @include('footer')
@endsection
