@extends('layout')

@section('title', $mediaMix->name)
@section('current-node-title', $mediaMix->name)
@section('ratingCheck', $mediaMix->rating == \App\Enums\Rating::None ? "false" : "true")

@section('current-node-content')
    @include('common.current-node-ogp', ['model' => $mediaMix])
@endsection

@section('nodes')

    @include('common.related_products', ['model' => $mediaMix])

    @if ($mediaMix->mediaMixGroup && $mediaMix->mediaMixGroup->mediaMixes->count() > 1)
    <section class="node tree-node" id="footer-tree-node">
        <div class="node-head">
            <h2 class="node-head-text">関連作品</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            @foreach ($mediaMix->mediaMixGroup->mediaMixes as $sameMediaMix)
            @if ($sameMediaMix->id === $mediaMix->id)
                @continue
            @endif
            <section class="node basic" id="{{ $sameMediaMix->key }}-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.MediaMixDetail', ['mediaMixKey' => $sameMediaMix->key]) }}" class="node-head-text">{{ $sameMediaMix->name }}</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endforeach
        </div>
    </section>
@endif

    @php $franchise = $mediaMix->getFranchise(); @endphp

    {{-- 
    <section>
        <div class="node">
            <h2 class="head2 fade">
                関連ネットワーク
            </h2>
        </div>
        <div class="node-map" style="margin-bottom: 50px;">

            @foreach ($relatedNetworks as $relatedNetwork)
                <div class="node">
                    <div class="link-node-center fade">
                        <a href="{{ route('Game.MediaMixDetail', ['mediaMixKey' => $relatedNetwork->key]) }}">
                            {!! $relatedNetwork->node_name !!}
                        </a>
                    </div>
                </div>
            @endforeach

            @if ($mediaMix->getFranchise())
                <div class="node">
                    <div class="link-node-center fade">
                        <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $mediaMix->getFranchise()->key]) }}">
                            {{ $mediaMix->getFranchise()->node_name }}<br>
                            フランチャイズ
                        </a>
                    </div>
                </div>
            @endif

        </div>
    </section>

    @include('footer')



    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.MediaMix.Detail', $mediaMix) }}">管理</a>
        </div>
    @endif
     --}}
@endsection
