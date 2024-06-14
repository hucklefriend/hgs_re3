@extends('layout')

@section('title', 'Information.hgn')

@section('content')
    <div style="text-align:center; margin: 20px 0;">
        <h1 class="head1">Information</h1>
    </div>


    <section class="info">
        @empty($infoList)
            <div class="node">
                <div class="text-node">
                    現在、お知らせはありません。
                </div>
            </div>
        @else
            @foreach ($infoList as $info)
                <div class="node">
                    <div class="content-link-node">
                        <a href="{{ route('Info', $info) }}">{{ $info->head }}</a>
                    </div>
                </div>
            @endforeach
        @endempty

        @include('common.paging', ['pager' => $infoList, 'route' => 'Info.Network'])
    </section>

    @include('footer')
@endsection
