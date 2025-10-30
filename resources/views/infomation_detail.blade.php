@extends('layout')

@section('title', 'お知らせ')
@section('current-node-title', $info->head)

@section('current-node-content')
    <p>
        {!! nl2br($info->body) !!}
    </p>
    <div style="margin-top: 30px;font-size: 13px;">
        【掲載期間】<br>
        {{ $info->open_at }} ～ {{ $info->close_at }}
    </div>
@endsection


@section('nodes')
    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">近道</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node link-tree-node" id="back-to-informations-node">
                <div class="node-head">
                    <a href="{{ route('Informations') }}" class="node-head-text">お知らせ</a>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content tree">
                    <section class="node link-node" id="back-to-root-node">
                        <div class="node-head">
                            <a href="{{ route('Root') }}" class="node-head-text">トップ</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                </div>
            </section>

        
            @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Admin.Manage.Information.Show', $info) }}" class="node-head-text" rel="external">管理</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endif
        </div>
    </section>
@endsection
