@foreach ($nodes as $nodeId => $node)
<section class="node {{ !empty($node['children']) ? 'link-tree-node' : 'link-node' }}" id="{{ $nodeId }}">
    <div class="node-head">
        <a href="{{ $node['url'] }}" class="node-head-text">{{ $node['title'] }}</a>
        <span class="node-pt">●</span>
    </div>
    @if(!empty($node['children']))
    <div class="node-content tree">
        @include('common.shortcut_node', ['nodes' => $node['children']])
    </div>
    @endif
</section>
@endforeach
