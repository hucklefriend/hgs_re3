<div>
    <div class="link-node link-node-center fade @if($title->rating == \App\Enums\Rating::R18A) link-node-a @endif @if($title->rating == \App\Enums\Rating::R18Z) link-node-z @endif ">
        <a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $title->key]) }}">{!! $title->node_name !!}</a>
    </div>
</div>
