@extends('layout')

@section('title', 'FranchiseNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1 fade">
                {!! $franchise->h1_node_name !!}<br>
                フランチャイズ
            </h1>
        </div

        @if (!empty($franchise->description))
            <section>
                <div class="node node-center">
                    <div class="text-node fade">
                        @include('common.description', ['model' => $franchise])
                    </div>
                </div>
            </section>
        @endif

        @foreach($franchise->series as $series)
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2 fade">{{ $series->name }}シリーズ</h2>
                <div class="node-map">
                    @foreach ($series->titles as $title)
                        <div>
                            <div class="link-node link-node-center fade">
                                <a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $title->key]) }}">{!! $title->node_name !!}</a>
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endforeach

        @if ($franchise->titles->count() > 0)
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2 fade">単体タイトル</h2>
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


        @if ($franchise->mediaMixGroups->isNotEmpty())
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2 fade">メディアミックス</h2>

                @foreach ($franchise->mediaMixGroups as $mediaMixGroup)
                    @empty($mediaMixGroup->description)
                        <h3 class="head3 fade">{{ $mediaMixGroup->name }}</h3>
                    @else
                    <h3 class="head3 fade" style="margin-bottom: 5px;">
                        {{ $mediaMixGroup->name }}
                    </h3>
                    <div class="node">
                        <div class="text-node small fade">
                            {!! nl2br($mediaMixGroup->description) !!}
                        </div>
                    </div>
                    @endif

                    <div class="node-map">
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
                <div class="node-map">
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
    </div>

    @include('footer')
@endsection
