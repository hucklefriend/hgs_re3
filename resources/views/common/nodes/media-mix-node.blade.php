<div>
    <div class="link-node link-node-center fade @if($mediaMix->rating == \App\Enums\Rating::R18A) link-node-a @endif ">
        <a href="{{ route('Game.MediaMixDetailNetwork', ['mediaMixKey' => $mediaMix->key]) }}">{!! $mediaMix->node_name !!}</a>
    </div>
</div>
