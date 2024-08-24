@extends('layout')

@section('title', $maker->name . ' | ホラーゲームネットワーク')

@section('content')
    <div class="node h1">
        <h1 class="head1 fade">
            {!! $maker->h1_node_name !!}
        </h1>
    </div>

    @if (!empty($maker->description))
        <section>
            <div class="node">
                <div class="text-node fade">
                    @include('common.description', ['model' => $maker])
                </div>
            </div>
        </section>
    @endif

    @if ($titles->count() > 0)
        <section>
            <div class="node h2">
                <h2 class="head2 fade">関連タイトル</h2>
            </div>
            <div class="node-map">
                @foreach ($titles as $title)
                    <div>
                        <div class="link-node link-node-center fade">
                            <a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $title->key]) }}">{!! $title->node_name !!}</a>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>
    @endif

    @include('footer', ['footerLinks' => $footerLinks])
@endsection
