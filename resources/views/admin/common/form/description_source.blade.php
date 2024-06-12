<div>
    <button onclick="descriptionFormat('wikipedia', '{{$name}}');" class="btn btn-sm btn-outline-blue mr-1" type="button">Wikipedia</button>
</div>
@include ('admin.common.form.textarea', ['name' => $name, 'options' => $options ?? []])

