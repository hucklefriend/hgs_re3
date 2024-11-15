@extends('layout')

@section('title', $maker->name . ' | ホラーゲームネットワーク')

@section('content')
    <div class="node h1">
        <h1 class="head1 fade">
            {!! $maker->h1_node_name !!}
        </h1>
    </div>

    @if (!empty($maker->description))
        <section>
            <div class="node">
                <div class="text-node fade">
                    @include('common.description', ['model' => $maker])
                </div>
            </div>
        </section>
    @endif

    @if ($titles->count() > 0)
        <section>
            <div class="node h2">
                <h2 class="head2 fade">関連タイトル</h2>
            </div>
            <div class="node-map">
                @foreach ($titles as $title)
                    @include('common.nodes.title-node', ['title' => $title])
                @endforeach
            </div>
        </section>
    @endif

    @include('footer', ['footerLinks' => $footerLinks])

    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.Maker.Detail', $maker) }}">管理</a>
        </div>
    @endif
@endsection
