@extends('layout')

@section('title', $franchise->name . 'フランチャイズ | ホラーゲームネットワーク')
@section('tree-header-title', $franchise->name . 'フランチャイズ')


@section('tree-header-content')
    <div class="header-node-content header-fade-mask">
        {!! nl2br($franchise->description) !!}
    </div>
@endsection

@section('tree-nodes')

    
    <section class="node sub-tree-node" id="title-lineup-tree-node">
        <header class="node header-node" id="title-lineup-header-node">
            <div class="node-head invisible">
                <h2 class="header-node-text active">タイトルラインナップ</h2>
                <span class="node-pt">●</span>
            </div>
        </header>
        <div class="sub-tree-node-container tree-container">
            <section class="node sub-tree-node" id="biohazard-series-tree-node">
                <header class="node header-node" id="biohazard-series-header-node">
                    <div class="node-head invisible">
                        <h2 class="header-node-text active">BIOHAZARDシリーズ</h2>
                        <span class="node-pt">●</span>
                    </div>
                </header>
                <div class="sub-tree-node-container tree-container">
                    <section class="node link-node" id="biohazard-link-node">
                        <div class="node-head invisible">
                            <a href="#" class="network-link">BIOHAZARD</a>
                            <span class="node-pt main-node-pt">●</span>
                        </div>
                        <div class="behind-node-container">
                        </div>
                        <canvas class="node-canvas"></canvas>
                    </section>
                    {{-- ------------------------------------------ 
                    <section class="node link-node" id="biohazard2-link-node">
                        <div class="node-head invisible">
                            <a href="#" class="network-link">BIOHAZARD2</a>
                            <span class="node-pt main-node-pt">●</span>
                        </div>
                        <div class="behind-node-container">
                        </div>
                        <canvas class="node-canvas"></canvas>
                    </section>
                    <section class="node link-node" id="biohazard3-link-node">
                        <div class="node-head invisible">
                            <a href="#" class="network-link">BIOHAZARD3</a>
                            <span class="node-pt main-node-pt">●</span>
                        </div>
                        <div class="behind-node-container">
                        </div>
                        <canvas class="node-canvas"></canvas>
                    </section>--}}
                </div>
                <canvas class="node-canvas"></canvas>
                <div class="connection-line" id="biohazard-series-connection-line"></div>
            </section>
            <section class="node sub-tree-node" id="biohazard-reverations-series-tree-node">
                <header class="node header-node" id="biohazard-reverations-series-header-node">
                    <div class="node-head invisible">
                        <h2 class="header-node-text active">BIOHAZARD REVERATIONSシリーズ</h2>
                        <span class="node-pt">●</span>
                    </div>
                </header>
                <div class="sub-tree-node-container tree-container">
                    <section class="node link-node" id="biohazard-reverations-link-node">
                        <div class="node-head invisible">
                            <a href="#" class="network-link">BIOHAZARD REVERATIONS</a>
                            <span class="node-pt main-node-pt">●</span>
                        </div>
                        <div class="behind-node-container">
                        </div>
                        <canvas class="node-canvas"></canvas>
                    </section>
                    <section class="node link-node" id="biohazard-reverations2-link-node">
                        <div class="node-head invisible">
                            <a href="#" class="network-link">BIOHAZARD REVERATIONS 2</a>
                            <span class="node-pt main-node-pt">●</span>
                        </div>
                        <div class="behind-node-container">
                        </div>
                        <canvas class="node-canvas"></canvas>
                    </section>
                    <section class="node link-node" id="biohazard-reverations3-link-node">
                        <div class="node-head invisible">
                            <a href="#" class="network-link">BIOHAZARD REVERATIONS 3</a>
                            <span class="node-pt main-node-pt">●</span>
                        </div>
                        <div class="behind-node-container">
                        </div>
                        <canvas class="node-canvas"></canvas>
                    </section>
                </div>
                <canvas class="node-canvas"></canvas>
                <div class="connection-line"></div>
            </section>
            <section class="node link-node" id="biohazard-gaiden-link-node">
                <div class="node-head invisible">
                    <a href="#" class="network-link">BIOHAZARD GAIDEN</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <div class="behind-node-container">
                </div>
                <canvas class="node-canvas"></canvas>
            </section>
        </div>
        <canvas class="node-canvas"></canvas>
        <div class="connection-line"></div>
    </section>

    <section class="node sub-tree-node" id="media-mix-tree-node">
        <header class="node header-node" id="media-mix-header-node">
            <div class="node-head invisible">
                <h2 class="header-node-text active">メディアミックス</h2>
                <span class="node-pt">●</span>
            </div>
        </header>
        <div class="sub-tree-node-container tree-container">


            <section class="node link-node" id="outlast-link-node">
                <div class="node-head invisible">
                    <a href="#" class="network-link">OUTLAST</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <div class="behind-node-container">
                </div>
                <canvas class="node-canvas"></canvas>
            </section>


        </div>
        <canvas class="node-canvas"></canvas>
        <div class="connection-line"></div>
    </section>



{{--
    <header class="node">
        <div class="node-head" style="margin-bottom: 10px;">
            <h1>{!! $franchise->h1_node_name !!}<br>フランチャイズ</h1>
            <span class="node-pt">●</span>
        </div>
        

        @if (!empty($franchise->description))
            <div class="node">
                <div class="text-node fade" id="description">
                    @include('common.description', ['model' => $franchise])
                </div>
            </div>
        @endif
    </header>
    <div class="node-container">
        <section class="node link-node" id="search-node">
            <div class="node-head disappear">
                <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="network-link">タイトルラインナップ</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container"></div>
            <div class="terminal-node-container">
                
            </div>
            <canvas class="node-canvas"></canvas>
        </section>
    </div>

    <section>
        <div class="node h1">
            <h1 class="head1 fade" id="h1_title">
                
            </h1>
        </div>
    </section>

    <section>
        <div class="node h2">
            <h2 class="head2 fade" id="h2_title_lineup">タイトルラインナップ</h2>
        </div>

        @foreach($franchise->series as $series)
            @empty($series->description)
                <div class="node h3">
                    <h3 class="head3 fade" id="h3_title_series_s{{ $series->id }}">{{ $series->node_name }}シリーズ</h3>
                </div>
            @else
                <div class="node h3">
                    <h3 class="head3 fade" style="margin-bottom: 5px;" id="h3_title_series_s{{ $series->id }}">{{ $series->node_name }}シリーズ</h3>
                </div>
                <div class="node">
                    <div class="text-node small fade" id="description_series_s{{ $series->id }}">
                        {!! nl2br($series->description) !!}
                    </div>
                </div>
            @endif

            <div class="node-map" style="margin-bottom: 50px;">
                @foreach ($series->titles as $title)
                    @include('common.nodes.title-node', ['title' => $title])
                @endforeach
            </div>
        @endforeach

        @if ($franchise->titles->count() > 0)
            <section>
                @if ($franchise->series->isNotEmpty())
                    <div class="node h3">
                        <h3 class="head3 fade" id="h3_title_single_titles">単体タイトル</h3>
                    </div>
                @endif
                <div class="node-map">
                    @foreach ($franchise->titles as $title)
                        @include('common.nodes.title-node', ['title' => $title])
                    @endforeach
                </div>
            </section>
        @endif
    </section>


    @if ($franchise->mediaMixGroups->isNotEmpty())
        <section>
            <div class="node h2">
                <h2 class="head2 fade" id="h2_title_media_mix">メディアミックス</h2>
            </div>

            @foreach ($franchise->mediaMixGroups->sortBy('sort_order') as $mediaMixGroup)
                @empty($mediaMixGroup->description)
                    <div class="node h3">
                        <h3 class="head3 fade" id="h3_title_media_mix_group_mg{{ $mediaMixGroup->id }}">{{ $mediaMixGroup->node_name }}</h3>
                    </div>
                @else
                    <div class="node h3">
                        <h3 class="head3 fade" style="margin-bottom: 5px;" id="h3_title_media_mix_group_mg{{ $mediaMixGroup->id }}">
                            {{ $mediaMixGroup->node_name }}
                        </h3>
                    </div>
                    <div class="node">
                        <div class="text-node small fade" id="description_media_mix_group_mg{{ $mediaMixGroup->id }}">
                            {!! nl2br($mediaMixGroup->description) !!}
                        </div>
                    </div>
                @endif

                <div class="node-map" style="margin-bottom: 50px;">
                    @foreach ($mediaMixGroup->mediaMixes->sortBy('sort_order') as $mediaMix)
                        @include('common.nodes.media-mix-node', ['mediaMix' => $mediaMix])
                    @endforeach
                </div>
            @endforeach
        </section>
    @elseif ($franchise->mediaMixes->isNotEmpty())
        <section style="margin-top: 50px;margin-bottom: 30px;">
            <h2 class="head2 fade" id="h2_title_media_mix">メディアミックス</h2>
            <div class="node-map" style="margin-bottom: 50px;">
                @foreach ($franchise->mediaMixes as $mediaMix)
                    @include('common.nodes.media-mix-node', ['mediaMix' => $mediaMix])
                @endforeach
            </div>
        </section>
    @endif

    @include('footer')

    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.Franchise.Detail', $franchise) }}">管理</a>
        </div>
    @endif
--}}
@endsection
