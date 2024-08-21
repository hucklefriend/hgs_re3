@if ($model->relatedProducts->count() > 0)
<section>
    <div class="node">
        <h2 class="head2 fade">関連商品</h2>
    </div>
    <div class="product-list">
        @foreach ($model->relatedProducts->sortByDesc('sort_order') as $rp)
            <div class="product-info">
                <div class="text-node fade">
                    {!! $rp->node_name !!}
                    @if ($rp->imgShop)
                        <div style="display:flex;flex-direction:column;align-items: center;margin-bottom: 1rem;">
                            {!! $rp->imgShop->img_tag !!}
                            <div style="font-size: 10px;">
                                画像提供元 <a href="{{ $rp->imgShop->url }}"><i class="bi bi-shop"></i> {{ $rp->imgShop->shop()->name }}</a>
                            </div>
                        </div>
                    @endif

                    @if ($rp->shops->count() > 0)
                        <div style="margin-top: 10px;" class="shop-link">
                            @foreach($rp->shops as $shop)
                                <a href="{{ $shop->url }}" target="_blank" rel="sponsored" style="white-space: nowrap;margin-right: 1rem;">
                                    <i class="bi bi-shop"></i> {{ $shop->shop()->name }}
                                </a>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>
        @endforeach
    </div>

    <div class="node node-center">
        <div class="text-node small fade">
            ショップによって廉価版や再発売版など、商品の仕様が異なる場合があります。<br>
            中古商品もありますので、購入前にショップの商品情報をよく確認してください。<br>
            掲載画像については<a href="{{ route('PrivacyPolicy') }}">Privacy Policy</a>のアフィリエイト項を見てください。
        </div>
    </div>
</section>
@endif
