@extends('layout')

@section('title', 'MakerNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">
                {!! $maker->h1_node_name !!}
            </h1>
        </div>

        @if (!empty($maker->description))
            <section>
                <div class="node node-center">
                    <div class="text-node">
                        @include('common.description', ['model' => $maker])
                    </div>
                </div>
            </section>
        @endif

        @if ($titles->count() > 0)
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2">関連タイトル</h2>
                <div class="node-map">
                    @foreach ($titles as $title)
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
