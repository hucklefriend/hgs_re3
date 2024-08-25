@if ($model->relatedProducts->count() > 0)
<section>
    <div class="node">
        <h2 class="head2 fade">関連商品</h2>
    </div>
    <div class="product-list">
        @foreach ($model->relatedProducts->sortByDesc('sort_order') as $rp)
            <div class="product-info">
                <div class="text-node fade">
                    @if ($rp->imgShop)
                        <div style="display:flex;flex-direction:column;align-items: center;margin-bottom: 1rem;">
                            {!! $rp->imgShop->img_tag !!}
                            <div style="font-size: 10px;">
                                画像提供元 <a href="{{ $rp->imgShop->url }}"><i class="bi bi-shop"></i> {{ $rp->imgShop->shop()->name() }}</a>
                            </div>
                        </div>
                    @else
                        <div style="display:flex;flex-direction:column;align-items: center;margin-bottom: 1rem; padding: 2rem 0;">
                            <img src="{{ $rp->default_img_type->imgUrl() }}" style="max-width: 100px;max-height: 100px;">
                        </div>
                    @endif
                    {!! $rp->node_name !!}

                    @if ($rp->shops->count() > 0)
                        <div class="shop-link">
                            @foreach($rp->shops as $shop)
                                <div>
                                    <a href="{{ $shop->url }}" target="_blank" rel="sponsored">
                                        <i class="bi bi-shop"></i> {{ $shop->shop()->name() }}
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
