@extends('layout')

@section('title', 'FranchiseNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 50px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">{!! $pkg->name !!}</h1>
        </div>
    </div>

    <div class="node">
        <div class="text-node" style="white-space: nowrap;">
            <table>
                <tr>
                    <th>プラットフォーム</th>
                    <td>{{ $pkg->platform->name }}</td>
                </tr>
                <tr>
                    <th>発売日</th>
                    <td>{{ $pkg->release_at }}</td>
                </tr>
            </table>
        </div>
    </div>


    <div class="node" style="align-items: end">
        <h2 class="head2">購入</h2>
    </div>



    <div class="node-lineup">
        <div>
            <div class="dom-node link-node-center">
                <a href="https://amzn.to/3QF3xDZ" target="_blank">amazon</a>
            </div>
        </div>
    </div>


    <div class="node">
        <h2 class="head2">
            関連ネットワーク
        </h2>
    </div>
    <div class="node-lineup">
        @foreach ($pkg->titles as $title)
            <div>
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.TitleNetwork', $title) }}">{!! $title->node_name !!}</a>
                </div>
            </div>
        @endforeach
        <div>
            <div class="link-node link-node-center">
                <a href="{{ route('Game.MakerDetailNetwork', $pkg->maker) }}">{!! $pkg->maker->node_name !!}</a>
            </div>
        </div>
            <div>
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.PlatformDetailNetwork', $pkg->platform) }}">{!! $pkg->platform->node_name !!}</a>
                </div>
            </div>
    </div>


    @include('footer')
@endsection
