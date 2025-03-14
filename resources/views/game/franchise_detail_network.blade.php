@extends('layout')

@section('title', $franchise->name . 'フランチャイズ | ホラーゲームネットワーク')

@section('content')
    <section>
        <div class="node h1">
            <h1 class="head1 fade" id="h1_title">
                {!! $franchise->h1_node_name !!}<br>
                フランチャイズ
            </h1>
        </div>

        @if (!empty($franchise->description))
            <div class="node">
                <div class="text-node fade" id="description">
                    @include('common.description', ['model' => $franchise])
                </div>
            </div>
        @endif
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

@endsection
