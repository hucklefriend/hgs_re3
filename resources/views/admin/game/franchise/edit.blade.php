@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <form method="POST" action="{{ route('Admin.Game.Franchise.Update', $model) }}">
            @csrf
            {{ method_field('PUT') }}

            <div class="panel-body">
                @include('admin.game.franchise.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.Franchise.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection
@section('js')
    @vite(['resources/js/app.js', 'resources/js/network-editor.js'])

    <script>
        window.addEventListener('DOMContentLoaded', function() {
            window.mainNetworkEditor.start(@json($data));
        });

        // document.getElementById('add_series_node').addEventListener('click', function() {
        //     const seriesNodes = document.getElementById('series_nodes');
        //
        //     const selectedSeriesNode = seriesNodes.options[seriesNodes.selectedIndex];
        //     const seriesNodeName = selectedSeriesNode.getAttribute('data-name');
        //     window.networkEditor.appendNode(selectedSeriesNode.value, seriesNodeName);
        // });
    </script>
@endsection
