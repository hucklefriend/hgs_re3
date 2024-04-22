@extends('layout')

@section('content')
    <div class="node-list">
        <div class="node node-around">
            <div class="link-node">
                <a href="{{ route('HGN') }}"><i class="icon-arrow-left"></i></a>
            </div>
            <div class="link-node">
                <i class="bi bi-search"></i>
            </div>
        </div>
        <div class="node-lineup">
        @foreach ($franchises as $franchise)
            <div>
            <div class="link-node link-node-center">
                {!! $franchise->node_title !!}
            </div>
            </div>
        @endforeach
        </div>
    </div>
@endsection
