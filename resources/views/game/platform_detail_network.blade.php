@extends('layout')

@section('title', $platform->name . '.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1 fade">
                {!! $platform->h1_node_name !!}
            </h1>
        </div>

        @if (!empty($platform->description))
            <section>
                <div class="node node-center">
                    <div class="text-node fade">
                        @include('common.description', ['model' => $platform])
                    </div>
                </div>
            </section>
        @endif

        @if ($platform->relatedProducts->count() > 0)
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2 fade">ハードウェア</h2>
                <div class="product-list">
                    @foreach ($platform->relatedProducts as $rp)
                        <div class="product-info">
                            <div class="text-node fade">
                                @if ($rp->img_s_url !== null)
                                    <div>
                                        <img src="{{ conv_asset_url($rp->img_s_url) }}" alt="{{ $rp->name }}">
                                    </div>
                                @endif
                                {!! $rp->node_name !!}

                                @if ($rp->shops->count() > 0)
                                    <div style="margin-top: 10px;" class="shop-link">
                                        @foreach($rp->shops as $shop)
                                            <a href="{{ $rp->url }}" target="_blank" rel="sponsored" style="white-space: nowrap;margin-right: 1rem;">
                                                <i class="bi bi-shop"></i> {{ $rp->shop()->name }}
                                            </a>
                                        @endforeach
                                    </div>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endif

        @if ($titles->count() > 0)
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2 fade">タイトル</h2>
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
    </div>

    @include('footer')
@endsection
