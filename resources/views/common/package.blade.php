<div class="product-info">
    <div class="text-node fade">
        @if ($pkg->imgShop)
            <div style="display:flex;flex-direction:column;align-items: center;margin-bottom: 1rem;">
                {!! $pkg->imgShop->img_tag !!}
                <div style="font-size: 10px;">
                    画像提供元 <a href="{{ $pkg->imgShop->url }}"><i class="bi bi-shop"></i> {{ $pkg->imgShop->shop()->name }}</a>
                </div>
            </div>
        @else
            <div style="display:flex;flex-direction:column;align-items: center;margin-bottom: 1rem; padding: 2rem 0;">
                <img src="{{ $pkg->default_img_type->imgUrl() }}" style="max-width: 100px;max-height: 100px;">
            </div>
        @endif
        @if (!($isGroup ?? false))
            {!! $pkg->node_name !!}
        @elseif (!empty($pkg->acronym))
            {!! $pkg->acronym !!}
        @endif
        <div style="margin-top: 10px;">
            {{ $pkg->platform->name }}<br>
            {{ $pkg->release_at }}
        </div>

        @if ($pkg->shops->count() > 0)
            <div style="margin-top: 10px;" class="shop-link">
                @foreach($pkg->shops as $shop)
                    <a href="{{ $shop->url }}" target="_blank" rel="sponsored" style="white-space: nowrap;margin-right: 1rem;">
                        <i class="bi bi-shop"></i> {{ $shop->shop()->name ?? '--' }}
                    </a>
                @endforeach
            </div>
        @endif
    </div>
</div>
