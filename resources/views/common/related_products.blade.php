@if ($model->relatedProducts->count() > 0)
<section>
    <div class="node">
        <h2 class="head2 fade">関連商品</h2>
    </div>
    <div class="product-list">
        @foreach ($model->relatedProducts as $rp)
            <div class="product-info">
                <div class="text-node fade">
                    @if ($rp->img_s_url !== null)
                        <div>
                            <img src="{{ $rp->img_s_url }}" alt="{{ $rp->name }}">
                        </div>
                    @endif
                    {!! $rp->node_name !!}

                    @if ($rp->shops->count() > 0)
                        <div style="margin-top: 10px;" class="shop-link">
                            @foreach($rp->shops as $shop)
                                <a href="{{ $rp->url }}" target="_blank" rel="sponsored" style="white-space: nowrap;margin-right: 1rem;">
                                    <i class="bi bi-shop"></i> {{ $shop->shop()->name }}
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
