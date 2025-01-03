@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $franchise->name }} For Main Network</h4>
        </div>

        <div class="panel-body">
            <form>
                <fieldset>
                    <legend class="col-form-label col-sm-2 pt-0">ノード追加</legend>
                    <div>
                        <div class="form-group row">
                            <div class="col-1">
                                <label for="series_nodes" class="form-label mt-2">Series</label>
                            </div>
                            <div class="col-auto">
                                <select id="series_nodes" class="form-control default-select2">
                                    @foreach($series as $value => $label)
                                        <option value="{{ $value }}" data-name="{{ $label['node_name'] }}">{{ $label['name'] }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-auto">
                                <button id="add_series_node" class="btn btn-white">+</button>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-1">
                                <label for="title_nodes" class="form-label mt-2">Title</label>
                            </div>
                            <div class="col-auto">
                                <select id="title_nodes" class="form-control default-select2">
                                    @foreach($titles as $value => $label)
                                        <option value="{{ $value }}" data-name="{{ $label['node_name'] }}">{{ $label['name'] }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-auto">
                                <button id="add_title_node" class="btn btn-white">+</button>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset class="mt-3">
                    <legend class="col-form-label col-sm-2 pt-0">エッジ追加</legend>
                    <div class="form-group row">
                        <div class="col-1">
                            <label for="edge_from" class="col-form-label">From</label>
                        </div>
                        <div class="col-auto">
                            <select id="edge_from" class="form-control default-select2">
                                <option value="franchise_1">バイオハザード<br>フランチャイズ</option>
                            </select>
                        </div>
                    </div>
                </fieldset>
            </form>



            <div id="network-editor-control">
                <div class="btn-group">
                    <button class="btn btn-white active" id="mode_select_node">Node Mode</button>
                    <button class="btn btn-white" id="mode_select_edge">Edge Mode</button>
                </div>
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

        document.getElementById('add_series_node').addEventListener('click', function() {
            const seriesNodes = document.getElementById('series_nodes');

            const selectedSeriesNode = seriesNodes.options[seriesNodes.selectedIndex];
            const seriesNodeName = selectedSeriesNode.getAttribute('data-name');
            window.networkEditor.appendNode(selectedSeriesNode.value, seriesNodeName);
        });

        document.getElementById('add_title_node').addEventListener('click', function() {
            const titleNodes = document.getElementById('title_nodes');
            const selectedTitleNode = titleNodes.options[titleNodes.selectedIndex];
            const titleNodeName = selectedTitleNode.getAttribute('data-name');
            window.networkEditor.appendNode(selectedTitleNode.value, titleNodeName);
        });
    </script>
@endsection
