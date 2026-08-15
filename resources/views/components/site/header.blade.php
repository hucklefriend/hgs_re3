<header class="site-header" data-site-header>
    <div class="site-frame">
        <div class="site-header__grid" data-grid-frame>
            <a class="site-brand" href="{{ route('Root') }}" aria-label="ホラーゲームネットワーク トップ">
                <span class="site-brand__node" data-header-node aria-hidden="true"></span>
                <span class="site-brand__name">
                    <strong>HORROR GAME</strong>
                    <small>NETWORK</small>
                </span>
                <x-site.connection-terminal />
            </a>

            <nav class="site-header__nav" aria-label="ユーティリティ">
                <a href="{{ route('Game.Lineup') }}" @if(request()->routeIs('Game.Lineup')) aria-current="page" @endif><span>LINEUP</span><x-site.connection-terminal /></a>
                @auth
                    <a href="{{ route('User.MyNode.Top') }}" @if(request()->routeIs('User.MyNode.*')) aria-current="page" @endif><span>MY NODE</span><x-site.connection-terminal /></a>
                    <a href="{{ route('Account.Logout') }}"><span>LOGOUT</span><x-site.connection-terminal /></a>
                @else
                    <a href="{{ route('Account.Login') }}" @if(request()->routeIs('Account.Login')) aria-current="page" @endif><span>LOGIN</span><x-site.connection-terminal /></a>
                    <a href="{{ route('Account.Register') }}" @if(request()->routeIs('Account.Register')) aria-current="page" @endif><span>SIGN UP</span><x-site.connection-terminal /></a>
                @endauth
            </nav>
        </div>
    </div>
</header>
