@extends('layout')

@section('title', 'MakerNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">
                {!! $platform->h1_node_name !!}
            </h1>
        </div>


        <div class="node node-center">
            <div class="text-node">
                <blockquote>
                    {!! nl2br(e($platform->explain))  !!}

                    @if ($platform->explain_source_name !== null)
                        <footer style="text-align: right;margin-top:1rem;">— <cite>
                                @if ($platform->explain_source_url !== null)
                                    <a href="{{ $platform->explain_source_url }}" target="_blank">{{ $platform->explain_source_name }}</a>
                                @else
                                    {{ $platform->explain_source_name }}
                                @endif
                            </cite></footer>
                    @endif
                </blockquote>
            </div>
        </div>

        @if ($titles->count() > 0)
            <section style="margin-top: 50px;margin-bottom: 30px;">
                <h2 class="head2">関連タイトル</h2>
                <div class="node-map">
                    @foreach ($titles as $title)
                        <div>
                            <div class="link-node link-node-center">
                                <a href="{{ route('Game.TitleNetwork', $title) }}">{!! $title->node_name !!}</a>
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endif
    </div>

    @include('footer')
@endsection
