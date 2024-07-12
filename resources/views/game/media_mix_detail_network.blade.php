@extends('layout')

@section('title', 'FranchiseNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1 fade">
                {!! $mediaMix->h1_node_name !!}
            </h1>
        </div>

        @if (!empty($mediaMix->description))
            <section>
                <div class="node node-center">
                    <div class="text-node fade">
                        @include('common.description', ['model' => $title])
                    </div>
                </div>
            </section>
        @endif

        @include('common.related_products', ['model' => $mediaMix])

        <section>
            <div class="node">
                <h2 class="head2 fade">
                    関連ネットワーク
                </h2>
            </div>
            <div class="node-map">
                <div>
                    <div class="link-node link-node-center fade">
                        <a href="{{ route('Game.FranchiseDetailNetwork', ['franchiseKey' => $mediaMix->franchise->key]) }}">
                            {{ $mediaMix->franchise->node_name }}<br>
                            フランチャイズ
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>

    @include('footer')
@endsection
