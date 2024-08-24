@extends('layout')

@section('title', $franchise->name . 'フランチャイズ | ホラーゲームネットワーク')

@section('content')
    <section>
        <div class="node h1">
            <h1 class="head1 fade">
                {!! $franchise->h1_node_name !!}<br>
                フランチャイズ
            </h1>
        </div>

        @if (!empty($franchise->description))
            <div class="node">
                <div class="text-node fade">
                    @include('common.description', ['model' => $franchise])
                </div>
            </div>
        @endif
    </section>

    <section>
        <div class="node h2">
            <h2 class="head2 fade">タイトルラインナップ</h2>
        </div>

        @foreach($franchise->series as $series)
            @empty($series->description)
                <div class="node h3">
                    <h3 class="head3 fade">{{ $series->node_name }}シリーズ</h3>
                </div>
            @else
                <div class="node h3">
                    <h3 class="head3 fade" style="margin-bottom: 5px;">{{ $series->node_name }}シリーズ</h3>
                </div>
                <div class="node">
                    <div class="text-node small fade">
                        {!! nl2br($series->description) !!}
                    </div>
                </div>
            @endif

            <div class="node-map" style="margin-bottom: 50px;">
                @foreach ($series->titles as $title)
                    <div>
                        <div class="link-node link-node-center fade">
                            <a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $title->key]) }}">{!! $title->node_name !!}</a>
                        </div>
                    </div>
                @endforeach
            </div>
        @endforeach

        @if ($franchise->titles->count() > 0)
            <section>
                @if ($franchise->series->isNotEmpty())
                    <div class="node h3">
                        <h3 class="head3 fade">単体タイトル</h3>
                    </div>
                @endif
                <div class="node-map">
                    @foreach ($franchise->titles as $title)
                        <div>
                            <div class="link-node link-node-center fade">
                                <a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $title->key]) }}">{!! $title->node_name !!}</a>
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endif
    </section>


    @if ($franchise->mediaMixGroups->isNotEmpty())
        <section>
            <div class="node h2">
                <h2 class="head2 fade">メディアミックス</h2>
            </div>

            @foreach ($franchise->mediaMixGroups as $mediaMixGroup)
                @empty($mediaMixGroup->description)
                    <div class="node h3">
                        <h3 class="head3 fade">{{ $mediaMixGroup->node_name }}</h3>
                    </div>
                @else
                    <div class="node h3">
                        <h3 class="head3 fade" style="margin-bottom: 5px;">
                            {{ $mediaMixGroup->node_name }}
                        </h3>
                    </div>
                <div class="node">
                    <div class="text-node small fade">
                        {!! nl2br($mediaMixGroup->description) !!}
                    </div>
                </div>
                @endif

                <div class="node-map" style="margin-bottom: 50px;">
                    @foreach ($mediaMixGroup->mediaMixes->sortBy('sort_order') as $mediaMix)
                        <div>
                            <div class="link-node link-node-center fade">
                                <a href="{{ route('Game.MediaMixDetailNetwork', ['mediaMixKey' => $mediaMix->key]) }}">{!! $mediaMix->node_name !!}</a>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endforeach
        </section>
    @elseif ($franchise->mediaMixes->isNotEmpty())
        <section style="margin-top: 50px;margin-bottom: 30px;">
            <h2 class="head2 fade">メディアミックス</h2>
            <div class="node-map" style="margin-bottom: 50px;">
                @foreach ($franchise->mediaMixes as $mediaMix)
                    <div>
                        <div class="link-node link-node-center fade">
                            <a href="{{ route('Game.MediaMixDetailNetwork', ['mediaMixKey' => $mediaMix->key]) }}">[{{ $mediaMix->type->text() }}]{!! $mediaMix->node_name !!}</a>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>
    @endif

    @include('footer')
@endsection
