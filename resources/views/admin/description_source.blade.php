<div>
    <button onclick="descriptionFormat('wikipedia', '{{ $name }}');" class="btn btn-sm btn-outline-blue mr-1" type="button">Wikipedia</button>
</div>
<x-admin.textarea :name="$name" :model="$model" />

