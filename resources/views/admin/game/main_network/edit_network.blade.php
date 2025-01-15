@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Main Network</h4>
        </div>

        <div class="panel-body">
            <fieldset>
                <legend class="col-form-label col-sm-2 pt-0">ネットワーク追加</legend>
                <div>
                    <div class="form-group row">
                        <div class="col-auto">
                            <select id="franchise_network" class="form-control default-select2">
                                @foreach($networks as $net)
                                    <option value="f_{{ $net->game_franchise_id }}">{{ $net->franchise->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-auto">
                            <button id="add_franchise_network" class="btn btn-white">+</button>
                        </div>
                    </div>
                </div>
            </fieldset>

            <div id="network-editor-container">
                <div id="network-editor"></div>
            </div>

            <form id="save_form" action="{{ route('Admin.Game.MainNetwork.Save') }}" method="POST" class="mt-3">
                @csrf
                <button type="submit" class="btn btn-primary mb-3">Save</button>
                <textarea class="form-control w-100" id="json" name="json" readonly></textarea>
            </form>
        </div>
    </div>
@endsection

@section('js')
    @vite(['resources/js/app.js', 'resources/js/main-network-editor.js'])

    <script>
        const allNetworkData = @json($data);

        window.addEventListener('DOMContentLoaded', function() {
            window.mainNetworkEditor.start(@json([]));

            let select = document.getElementById('franchise_network');
            document.getElementById('add_franchise_network').addEventListener('click', () => {
                let networkId = select.options[select.selectedIndex].value;
                window.mainNetworkEditor.addNetwork(allNetworkData[networkId]);
            });
        });

    </script>
@endsection
