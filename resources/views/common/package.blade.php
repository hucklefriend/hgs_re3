<div class="product-info">
    <div class="text-node fade">
        @if ($pkg->img_s_url !== null)
            <div>
                <img src="{{ $pkg->img_s_url }}" alt="{{ $pkg->name }}">
            </div>
        @endif
        {!! $pkg->node_name !!}
        <div style="margin-top: 10px;">
            {{ $pkg->platform->name }}<br>
            {{ $pkg->release_at }}
        </div>

        @if ($pkg->shops->count() > 0)
            <div style="margin-top: 10px;" class="shop-link">
                @foreach($pkg->shops as $shop)
                    <a href="{{ $shop->url }}" target="_blank" rel="sponsored" style="white-space: nowrap;margin-right: 1rem;">
                        <i class="bi bi-shop"></i> {{ $shop->shop()->name }}
                    </a>
                @endforeach
            </div>
        @endif
    </div>
</div>
