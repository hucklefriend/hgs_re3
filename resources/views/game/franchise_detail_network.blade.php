@extends('layout')

@section('title', 'FranchiseNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">
                {!! $franchise->h1_node_name !!}<br>
                フランチャイズ
            </h1>
        </div>

        @foreach($franchise->series as $series)
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2">{{ $series->name }}シリーズ</h2>
                <div class="node-map">
                    @foreach ($series->titles as $title)
                        <div>
                            <div class="link-node link-node-center">
                                <a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $title->key]) }}">{!! $title->node_name !!}</a>
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endforeach

        @if ($franchise->titles->count() > 0)
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2">単体タイトル</h2>
                <div class="node-map">
                    @foreach ($franchise->titles as $title)
                        <div>
                            <div class="link-node link-node-center">
                                <a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $title->key]) }}">{!! $title->node_name !!}</a>
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endif
    </div>

    @include('footer')
@endsection
