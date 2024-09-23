<div class="product-info">
    <div class="text-node fade">
        <p class="platform-name">{{ $pkg->platform->acronym }}</p>

        <div class="pkg-img">
            @if ($pkg->imgShop)
                @if ($pkg->imgShop->ogp !== null)
                    <div>
                        <a href="{{ $pkg->imgShop->url }}">
                            <img src="{{ $pkg->imgShop->ogp->image }}" style="max-width: 100%;height: auto;">
                        </a>
                    </div>

                    <div class="shop-title">
                        <a href="{{ $pkg->imgShop->url }}">{{ $pkg->imgShop->ogp->title }}</a>
                    </div>
                @else
                    {!! $pkg->imgShop->img_tag !!}
                    <div class="shop-title">
                        画像提供元 <a href="{{ $pkg->imgShop->url }}"><i class="bi bi-shop"></i> {{ $pkg->imgShop->shop()->name() }}</a>
                    </div>
                @endif
            @else
                <img src="{{ $pkg->default_img_type->imgUrl() }}" class="default-img">
            @endif
        </div>
        @if (!($isGroup ?? false))
            {!! $pkg->node_name !!}
        @elseif (!empty($pkg->acronym))
            {!! $pkg->acronym !!}
        @endif
        <div style="margin-top: 10px;">
            {{ $pkg->release_at }}
        </div>

        @if ($pkg->shops->count() > 0)
            <div class="shop-link">
                @foreach($pkg->shops as $shop)
                    <div>
                        <a href="{{ $shop->url }}" target="_blank" rel="sponsored">
                            <i class="bi bi-shop"></i><span class="shop-name">{{ $shop->shop()?->name() ?? '--' }}</span>
                        </a>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</div>
