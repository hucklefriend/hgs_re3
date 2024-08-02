
<hr>

<div class="node-map" style="margin-top:50px;margin-bottom: 50px;">
    <div>
        <div class="link-node link-node-center fade">
            <a href="{{ route('Entrance') }}">Entrance</a>
        </div>
    </div>
    <div>
        <div class="link-node fade">
            <a href="{{ route('Game.HorrorGameNetwork') }}">HorrorGame Network</a>
        </div>
    </div>
    {{--
    <div>
        <div class="link-node link-node-center">
            <a href="{{ route('Entrance') }}">Sign In / Sign Up</a>
        </div>
    </div>
    <div>
        <div class="link-node">
            <a href="{{ route('Entrance') }}">My Page</a>
        </div>
    </div>
    --}}

    @isset($footerLinks)
        @foreach($footerLinks as $name => $url)
            <div>
                <div class="link-node fade">
                    <a href="{{ $url }}">{{ $name }}</a>
                </div>
            </div>
        @endforeach
    @endisset
</div>
