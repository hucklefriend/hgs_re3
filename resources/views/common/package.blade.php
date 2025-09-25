<section class="node" id="biohazard-link-node">
    <div class="node-head">
        <span class="node-head-text">
            {{ $pkg->platform->acronym }}
            &nbsp;<img src="{{ $pkg->default_img_type->imgUrl() }}" class="default-img">
            @empty($pkg->node_name)
            @else
                &nbsp;{!! $pkg->node_name !!}
            @endif
            &nbsp;{{ $pkg->release_at }}
        </span>
        <span class="node-pt">●</span>
    </div>
    <div class="node-content basic">
        <div class="pkg-img">
            @if ($pkg->imgShop)
                @if ($pkg->imgShop->ogp !== null)
                    <div>
                        <a href="{{ $pkg->imgShop->url }}">
                            <img src="{{ $pkg->imgShop->ogp->image }}" width="{{ $pkg->imgShop->ogp->image_width }}" height="{{ $pkg->imgShop->ogp->image_height }}" class="pkg-img">
                        </a>
                    </div>

                    <div class="shop-title">
                        <a href="{{ $pkg->imgShop->url }}">{{ $pkg->imgShop->shop()->name() }}</a>
                    </div>
                @else
                    <div>
                        {!! $pkg->imgShop->img_tag !!}
                    </div>

                    <div class="shop-title">
                        画像提供元 <a href="{{ $pkg->imgShop->url }}" target="_blank" rel="sponsored"><i class="bi bi-shop"></i> {{ $pkg->imgShop->shop()->name() }}</a>
                    </div>
                @endif
            @else
                
            @endif

    
            @if ($pkg->shops->count() > 0)
                <div class="shop-link">
                    @foreach($pkg->shops as $shop)
                        <div>
                            <a href="{{ $shop->url }}" target="_blank" rel="sponsored">
                                <i class="bi bi-shop"></i>
                                <span class="shop-name">{{ $shop->shop()?->name() ?? '--' }}</span>
                            </a>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</section>

{{--
<div class="product-info">
    <div class="text-node fade @if($pkg->rating === \App\Enums\Rating::R18A) text-node-a @endif @if($pkg->rating == \App\Enums\Rating::R18Z) text-node-z @endif ">
        <p class="platform-name">
            @empty($pkg->node_name)
                {{ $pkg->platform->acronym }}
            @else
                {{ $pkg->platform->acronym }}&nbsp;{!! $pkg->node_name !!}
            @endif
        </p>

        <div class="pkg-img">
            @if ($pkg->imgShop)
                @if ($pkg->imgShop->ogp !== null)
                    <div>
                        <a href="{{ $pkg->imgShop->url }}">
                            <img src="{{ $pkg->imgShop->ogp->image }}" style="max-width: 100%;height: auto;">
                        </a>
                    </div>

                    <div class="shop-title">
                        <a href="{{ $pkg->imgShop->url }}">{{ $pkg->imgShop->shop()->name() }}</a>
                    </div>
                @else
                    <div>
                        {!! $pkg->imgShop->img_tag !!}
                    </div>

                    <div class="shop-title">
                        画像提供元 <a href="{{ $pkg->imgShop->url }}"><i class="bi bi-shop"></i> {{ $pkg->imgShop->shop()->name() }}</a>
                    </div>
                @endif
            @else
                <img src="{{ $pkg->default_img_type->imgUrl() }}" class="default-img">
            @endif
        </div>

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
--}}
