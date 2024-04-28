@extends('layout')

@section('content')
    <div class="node-list">
        <div class="link-node">
            <a href="{{ route('HGN') }}"><i class="icon-arrow-left"></i></a>
        </div>
        <div class="node node-center">
            <div id="title-node" style="margin-top: 30px;">
                <h1>{{ $title->name }}</h1>

                <section style="margin-top:2rem;">
                    <h3>あらすじ</h3>
                    <blockquote>
                        {!! nl2br(e($title->introduction))  !!}

                        <footer style="text-align: right;margin-top:1rem;">— <cite>{!! $title->introduction_from  !!}</cite></footer>
                    </blockquote>
                </section>

                <section style="margin-top:2rem;">
                    <h3>レビュー</h3>
                    <div>
                        怖さ：★★★★☆
                    </div>
                </section>
            </div>
        </div>

        <div class="node">
            <div class="dom-node">
                パッケージ
            </div>
        </div>
        <div class="node-lineup">
            @foreach ($packages as $package)
                <div>
                    <div class="content-link-node">
                        <a href="#test">
                            {{ $package->acronym }}
                        </a>
                    </div>
                </div>
            @endforeach
        </div>



        <div class="node">
            <div class="content-link-node">
                タグ
            </div>
        </div>
        <div class="node-lineup">
            <div>
                <div class="link-node">
                    <a href="#test">アドベンチャー</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">アドベンチャー</a>
                </div>
            </div>
        </div>




        <div class="node">
            <div class="dom-node">
                タグ
            </div>
        </div>
        <div class="node-lineup">
            <div>
                <div class="link-node">
                    <a href="#test">レビュー</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">攻略</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">日記</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">辞書</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">二次創作</a>
                </div>
            </div>
        </div>

        <div class="node">
            <div class="content-link-node">
                関連商品
            </div>
        </div>
        <div class="node-lineup">
            <div>
                <div class="link-node">
                    <a href="#test">アドベンチャー</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">アドベンチャー</a>
                </div>
            </div>
        </div>
    </div>


@endsection
