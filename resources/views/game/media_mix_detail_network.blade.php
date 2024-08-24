@extends('layout')

@section('title', $mediaMix->name . ' | ホラーゲームネットワーク')

@section('content')
    <section>
        <div class="node">
            <h1 class="head1 fade">
                {!! $mediaMix->h1_node_name !!}
            </h1>
        </div>
        @if (!empty($mediaMix->description))
            <div class="node">
                <div class="text-node fade">
                    @include('common.description', ['model' => $mediaMix])
                </div>
            </div>
        @endif
    </section>

    @include('common.related_products', ['model' => $mediaMix])

    <section>
        <div class="node">
            <h2 class="head2 fade">
                関連ネットワーク
            </h2>
        </div>
        <div class="node-map" style="margin-bottom: 50px;">

            @foreach ($relatedNetworks as $relatedNetwork)
                <div class="node">
                    <div class="link-node link-node-center fade">
                        <a href="{{ route('Game.MediaMixDetailNetwork', ['mediaMixKey' => $relatedNetwork->key]) }}">
                            {!! $relatedNetwork->node_name !!}
                        </a>
                    </div>
                </div>
            @endforeach
            <div>

                @if ($mediaMix->getFranchise())
                <div class="link-node link-node-center fade">
                    <a href="{{ route('Game.FranchiseDetailNetwork', ['franchiseKey' => $mediaMix->getFranchise()->key]) }}">
                        {{ $mediaMix->getFranchise()->node_name }}<br>
                        フランチャイズ
                    </a>
                </div>
                @endif
            </div>
        </div>
    </section>

    @include('footer')
@endsection
