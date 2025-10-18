@extends('layout')

@section('title', 'お知らせ')
@section('current-node-title', 'お知らせ')

@section('nodes')
    @if ($informations->isEmpty())
        <section class="node">
            <div class="node-head">
                <h2 class="node-head-text">現在、お知らせはありません。</h2>
                <span class="node-pt">●</span>
            </div>
        </section>
    @else
        @foreach ($informations as $info)
        <section class="node link-node" id="info-{{ $info->id }}-link-node">
            <div class="node-head">
                <a href="{{ route('InformationDetail', $info) }}" class="node-head-text">{{ $info->head }}</a>
                <span class="node-pt">●</span>
            </div>
        </section>
        @endforeach
    @endempty
    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">近道</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Root') }}" class="node-head-text">トップ</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
            </section>

        
            @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Admin.Manage.Information') }}" class="node-head-text" rel="external">管理</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endif
        </div>
    </section>
@endsection
