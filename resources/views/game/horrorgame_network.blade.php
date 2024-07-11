@extends('layout')

@section('title', 'HorrorGameNetwork.hgn')

@section('content')
    <style>
        .node-map {
            justify-content: center;
        }
    </style>


    <div class="node-list">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1 fade">HorrorGame Network</h1>
        </div>

        <div class="node node-right">
            <div class="popup-link-node fade" id="search" data-target="search-popup">
                <i class="bi bi-search"></i>
            </div>
        </div>

        @empty($groups)
            <div class="node">
                <div class="text-node fade">
                    検索条件に一致するゲームが見つかりませんでした。
                </div>
            </div>
        @endempty
        @foreach ($groups as $games)
        <div class="node-map">
            @foreach ($games as $game)
                <div>
                    <div class="link-node link-node-center fade" id="{{ $game->dom_id }}" data-connect="{{ json_encode($game->connections) }}">
                        <a href="{{ route('Game.TitleDetailNetwork',  ['titleKey' => $game->title->key]) }}">{!! $game->title->node_name !!}</a>
                    </div>
                </div>
            @endforeach
        </div>
        @endforeach


        <div class="node-list node-around" style="margin-top:100px;margin-bottom: 50px;">
            <div>
                @isset($prev['page'])
                <div class="link-node link-node-center fade">
                    <a href="{{ route('Game.HorrorGameNetwork', $prev) }}">&lt;&lt; Prev</a>
                </div>
                @endif
            </div>
            <div>
                @isset($next['page'])
                <div class="link-node link-node-center fade">
                    <a href="{{ route('Game.HorrorGameNetwork', $next) }}">Next &gt;&gt;</a>
                </div>
                @endif
            </div>
        </div>

        @include('footer')
    </div>
@endsection

@section('popup')
    <div class="popup-node horrorgame_search" id="search-popup">
        <div class="popup-container">
            <form method="get" action="{{ route('Game.HorrorGameNetwork') }}" onsubmit="return search();">
                <label for="search-name">ゲームタイトル</label>
                <div>
                    <input type="text" name="name" value="{{ $search['n'] }}" id="search-name" style="width: 100%;" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" autocomplete="off">
                </div>
                <label>プラットフォーム</label>
                <div id="platform_check">
                    @foreach ($platforms as $platform)
                        <div>
                            <input type="checkbox" name="platform" value="{{ $platform->id }}" id="p_{{ $platform->id }}" @checked(in_array($platform->id, $search['p']))>
                            <label for="p_{{ $platform->id }}">{{ $platform->name }}</label>
                        </div>
                    @endforeach
                </div>
                <label>レーティング</label>
                <div id="rating_check">
                    @foreach (\App\Enums\Rating::selectList() as $id => $name)
                        <div>
                            <input type="checkbox" name="rating" value="{{ $id }}" id="rating_{{ $id }}" @checked(in_array($id, $search['r']))>
                            <label for="rating_{{ $id }}">{{ $name }}</label>
                        </div>
                    @endforeach
                </div>
                <div id="search-footer">
                    <div>
                        <button type="button" style="margin:auto;" class="popup-node-close bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded">Cancel</button>
                    </div>
                    <div>
                        <button type="submit" style="margin:auto;" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Search</button>
                    </div>
                </div>
            </form>
        </div>
        <canvas class="popup-node-canvas"></canvas>
        <script>
            function search()
            {
                window.hgn.closePopupNode('search-popup');

                let name = document.querySelector('.horrorgame_search input[name="name"]').value;
                let platform = [];
                let rating = [];
                // name=platformでチェックが入っている値を取得
                document.querySelectorAll('.horrorgame_search input[name="platform"]:checked').forEach(function(e){
                    platform.push(e.value);
                });
                // name=ratingでチェックが入っている値を取得
                document.querySelectorAll('.horrorgame_search input[name="rating"]:checked').forEach(function(e){
                    rating.push(e.value);
                });

                // formのactionにname、platformのカンマ区切り文字列、ratingのカンマ区切り文字列を追加
                let url = '{{ route('Game.HorrorGameNetwork') }}';
                let params = [];
                if (name.length > 0) {
                    params.push('n=' + name);
                }
                if (platform.length > 0) {
                    params.push('p=' + platform.join(','));
                }
                if (rating.length > 0) {
                    params.push('r=' + rating.join(','));
                }
                if (params.length > 0) {
                    url += '?' + params.join('&');
                }

                window.hgn.changeNetwork(url);

                return false;
            }
        </script>
    </div>
@endsection
