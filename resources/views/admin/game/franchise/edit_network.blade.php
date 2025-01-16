@extends('admin.layout_edit_network')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $parent->name }}</h4>
        </div>




        <form method="POST" action="{{ route('Admin.Game.Series.SaveNetwork', $parent) }}">
            @csrf

            <div id="edit-network">
                <div id="parent">
                    <div class="draggable">
                        <span>{{ $parent->name }}</span>
                    </div>

                    @foreach($children as $child)
                        <div class="draggable">
                            <span>{!! $child->node_name !!}</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </form>
    </div>
@endsection
