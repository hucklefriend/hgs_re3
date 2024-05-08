@extends('layout')

@section('title', 'FranchiseNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">
                {!! $franchise->node_title !!}<br>
                フランチャイズ
            </h1>
        </div>

        @foreach($franchise->series as $series)
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2">{{ $series->name }}シリーズ</h2>
                <div class="node-lineup">
                    @foreach ($series->titles as $title)
                        <div>
                            <div class="link-node link-node-center">
                                <a href="{{ route('Game.TitleNetwork', $title) }}">{!! $title->node_title !!}</a>
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endforeach

        @if (!empty($franchise->titles))
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2">単体タイトル</h2>
                <div class="node-lineup">
                    @foreach ($franchise->titles as $title)
                        <div>
                            <div class="link-node link-node-center">
                                <a href="{{ route('Game.TitleNetwork', $title) }}">{!! $title->node_title !!}</a>
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endif

        <div class="node-lineup">
        </div>
    </div>

    @include('footer')
@endsection
