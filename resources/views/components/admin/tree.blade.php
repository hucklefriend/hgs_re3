<div class="game-tree">
    <ul>
        <li data-jstree='{"opened":true @if($node->selected) , "selected":true @endif }'><a href="{{ $node->getDetailUrl() }}">{{ $node->name }}</a>
        @if (!empty($node->getChildren()))
            @include('components.admin.tree-children', ['tree' => $node])
        @endif
        </li>
    </ul>
</div>
