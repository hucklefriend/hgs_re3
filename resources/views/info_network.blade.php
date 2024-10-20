@extends('layout')

@section('title', 'Information | ホラーゲームネットワーク')

@section('content')
    <div style="text-align:center; margin: 20px 0;">
        <h1 class="head1 fade">Information</h1>
    </div>


    <section class="info">
        @if ($infoList->isEmpty())
            <div class="node">
                <div class="text-node fade">
                    現在、お知らせはありません。
                </div>
            </div>
        @else
            @foreach ($infoList as $info)
                <div class="node">
                    <div class="content-link-node fade">
                        <a href="{{ route('Info', $info) }}">{{ $info->head }}</a>
                    </div>
                </div>
            @endforeach
        @endempty

        @include('common.paging', ['pager' => $infoList, 'route' => 'Info.Network'])
    </section>

    @include('footer')
@endsection
