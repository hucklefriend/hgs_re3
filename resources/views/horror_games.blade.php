@extends('layout')

@section('title', 'Horror Games | ホラーゲームネットワーク')

@section('content')
    <header class="node">
        <div class="node-head" style="margin-bottom: 10px;">
            <h1>Horror Games</h1>
            <span class="node-pt">●</span>
        </div>
    </header>
    <div class="node-container">
        <section class="node link-node" id="search-node">
            <div class="node-head disappear">
                <a href="#" class="network-link">Search</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container"></div>
            <div class="terminal-node-container">
                タイトル、発売時期などから検索できます。
                {{-- 検索フォーム 
                <form>
                    <div>
                        <label for="search-input">タイトル</label>
                        <input type="text" class="search-input" placeholder="Search">
                    </div>
                    <div>
                        <label>発売時期</label>
                        <input type="date" class="search-input" placeholder="Search">
                    </div>
                    <div>
                        <label>プラットフォーム</label>
                        <style>
                            .ts-wrapper .option .title {
                                display: block;
                            }
                            .ts-wrapper .option .url {
                                font-size: 12px;
                                display: block;
                                color: #a0a0a0;
                            }
                            </style>
                        <select id="select-links" multiple placeholder="Pick some links..."></select>
                        <script src="https://cdn.jsdelivr.net/npm/tom-select@2.0.0/dist/js/tom-select.complete.min.js"></script>
                        <script>
                            
                            new TomSelect('#select-links',{
                                valueField: 'id',
                                searchField: 'title',
                                options: [
                                    {id: 1, title: 'DIY', url: 'https://diy.org'},
                                    {id: 2, title: 'Google', url: 'http://google.com'},
                                    {id: 3, title: 'Yahoo', url: 'http://yahoo.com'},
                                ],
                                render: {
                                    option: function(data, escape) {
                                        return '<div>' +
                                                '<span class="title">' + escape(data.title) + '</span>' +
                                                '<span class="url">' + escape(data.url) + '</span>' +
                                            '</div>';
                                    },
                                    item: function(data, escape) {
                                        return '<div title="' + escape(data.url) + '">' + escape(data.title) + '</div>';
                                    }
                                }
                            });
                        </script>
                    </div>
                    <button type="submit">Search</button>
                </form>
                --}}
            </div>
            <canvas class="node-canvas"></canvas>
        </section>
        <section class="node link-node" id="franchises-node">
            <div class="node-head disappear">
                <a href="#" class="network-link">Franchises</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Steam</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>PlayStation</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Xbox</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Nintendo Switch</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Oculus</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>PSVR</span>
                </div>
            </div>
            <canvas class="node-canvas"></canvas>
            <div class="terminal-node-container">
                同じ世界観やキャラクターを共有するシリーズ作品群を1つのフランチャイズと定義し、フランチャイズ別にホラーゲームをリストアップしています。
            </div>
        </section>
        <section class="node link-node" id="platforms-node">
            <div class="node-head disappear">
                <a href="#" class="network-link">Platforms</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Steam</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>PlayStation</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Xbox</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Nintendo Switch</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Oculus</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>PSVR</span>
                </div>
            </div>
            <canvas class="node-canvas"></canvas>
            <div class="terminal-node-container">
                ゲームハードや配信プラットフォーム別にホラーゲームをリストアップしています。
            </div>
        </section>
        <section class="node link-node" id="makers-node">
            <div class="node-head disappear">
                <a href="#" class="network-link">Makers</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>任天堂</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>バンダイナムコ</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>カプコン</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>スクウェア・アニックス</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>FROM SOFTWARE</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>ソニー</span>
                </div>
            </div>
            <div class="terminal-node-container">
                ゲームメーカー別にホラーゲームをリストアップしています。<br>
                個人開発者や同人サークルなども1つのメーカーとしています。
            </div>
            <canvas class="node-canvas"></canvas>
        </section>
        <section class="node link-node" id="entrance-node">
            <div class="node-head disappear">
                <a href="{{ route('Entrance') }}" class="network-link">Entrance</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container"></div>
            <canvas class="node-canvas"></canvas>
        </section>
    </div>
@endsection
