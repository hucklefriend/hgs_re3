@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $franchise->name }} For Main Network</h4>
        </div>

        <div class="panel-body">
            <div>

            </div>
            <div id="network-editor-container">
                <div id="network-editor"></div>
                <canvas id="network-editor-canvas"></canvas>
            </div>
        </div>
    </div>
@endsection

@section('js')
    @vite(['resources/js/app.js', 'resources/js/editor.js'])

    <script>
        window.addEventListener('DOMContentLoaded', function() {
            window.networkEditor.start({'nodes': [{'id': 'franchise_1', 'name': 'バイオハザード<br>フランチャイズ', 'x': 0, 'y': 0}]});
        });
    </script>
@endsection
