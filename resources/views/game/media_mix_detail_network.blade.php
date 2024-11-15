@extends('layout')

@section('title', $mediaMix->name . ' | ホラーゲームネットワーク')

@section('content')
    @include('common.head1', ['model' => $mediaMix])

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

            @if ($mediaMix->getFranchise())
                <div class="node">
                    <div class="link-node link-node-center fade">
                        <a href="{{ route('Game.FranchiseDetailNetwork', ['franchiseKey' => $mediaMix->getFranchise()->key]) }}">
                            {{ $mediaMix->getFranchise()->node_name }}<br>
                            フランチャイズ
                        </a>
                    </div>
                </div>
            @endif

            @if ($mediaMix->titles()->exists())
                @foreach ($mediaMix->titles as $title)
                    <div class="node">
                        @include('common.nodes.title-node', ['title' => $title])
                    </div>
                @endforeach
            @endif
        </div>
    </section>

    @include('footer')



    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.MediaMix.Detail', $mediaMix) }}">管理</a>
        </div>
    @endif
@endsection
