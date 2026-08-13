@props(['pageKind'])

<header class="site-header" data-site-header>
    <div class="site-frame">
        <div class="site-header__grid" data-grid-frame>
            <a class="site-brand" href="{{ route('Root') }}" aria-label="ホラーゲームネットワーク トップ">
                <span class="site-brand__node" data-header-node aria-hidden="true"></span>
                <span class="site-brand__branches" aria-hidden="true"></span>
                <span class="site-brand__name">
                    <strong>HORROR GAME</strong>
                    <small>NETWORK</small>
                </span>
            </a>

            <p class="site-header__status" aria-label="ネットワーク状態">
                <span class="site-header__pulse" aria-hidden="true"></span>
                <span>NETWORK ONLINE</span>
                <small>{{ strtoupper($pageKind) }}</small>
            </p>

            <nav class="site-header__nav" aria-label="ユーティリティ">
                <a href="{{ route('Game.Lineup') }}" @if(request()->routeIs('Game.Lineup')) aria-current="page" @endif>LINEUP</a>
                @auth
                    <a href="{{ route('User.MyNode.Top') }}" @if(request()->routeIs('User.MyNode.*')) aria-current="page" @endif>MY NODE</a>
                @else
                    <a href="{{ route('Account.Login') }}" @if(request()->routeIs('Account.Login')) aria-current="page" @endif>LOGIN</a>
                @endauth
            </nav>
        </div>
    </div>
</header>
