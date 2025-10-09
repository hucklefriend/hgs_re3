<ul>
@foreach ($node->getChildren() as $child)
    <li data-jstree='{"opened":true @if($child->selected) , "selected":true @endif }'><a href="{{ $child->getDetailUrl() }}">({{ $child->acronym }}){{ $child->name }} {{ $child->node_name ?? '' }}</a><br>
    @if (!empty($child->getChildren()))
        @include('components.admin.tree-children', ['node' => $child])
    @endif
    </li>
@endforeach
</ul>
