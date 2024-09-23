@if ($model->relatedProducts->count() > 0)
<section>
    <div class="node">
        <h2 class="head2 fade">関連商品</h2>
    </div>
    <div class="product-list">
        @foreach ($model->relatedProducts->sortByDesc('sort_order') as $rp)
            <div class="product-info">
                <div class="text-node fade">

                    <div class="pkg-img">
                        @if ($rp->imgShop)
                            @if ($rp->imgShop->ogp !== null)
                                <div>
                                    <a href="{{ $rp->imgShop->url }}">
                                        <img src="{{ $rp->imgShop->ogp->image }}" style="max-width: 100%;height: auto;">
                                    </a>
                                </div>

                                <div class="shop-title">
                                    <a href="{{ $rp->imgShop->url }}">{{ $rp->imgShop->ogp->title }}</a>
                                </div>
                            @else
                                {!! $rp->imgShop->img_tag !!}
                                <div class="shop-title">
                                    <a href="{{ $rp->imgShop->url }}"><i class="bi bi-shop"></i> {{ $rp->imgShop->shop()->name() }}</a>
                                </div>
                            @endif
                        @else
                            <img src="{{ $rp->default_img_type->imgUrl() }}" class="default-img">
                        @endif
                    </div>

                    {!! $rp->node_name !!}

                    @if ($rp->shops->count() > 0)
                        <div class="shop-link">
                            @foreach($rp->shops as $shop)
                                <div>
                                    <a href="{{ $shop->url }}" target="_blank" rel="sponsored">
                                        <i class="bi bi-shop"></i><span>{{ $shop->shop()->name() }}</span>
                                    </a>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>
        @endforeach
    </div>

    <div class="node node-center">
        <div class="text-node small fade">
            ショップによっては廉価版など商品の仕様が異なる場合があります。<br>
            中古商品もありますのでショップ側で商品情報をご確認ください。
        </div>
    </div>
</section>
@endif
