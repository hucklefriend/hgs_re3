@extends('layout')

@section('title', 'お問い合わせが見つかりません | ホラーゲームネットワーク')
@section('current-node-title', 'お問い合わせが見つかりません')

@section('nodes')

    <section class="node">
        <div class="node-head">
            <h2 class="node-head-text">お問い合わせが見つかりません</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <div style="text-align: center; padding: 50px 20px;">
                <p style="font-size: 64px; margin: 0;">😞</p>
                <p style="font-size: 18px; margin: 20px 0; color: #666;">
                    お問い合わせが見つかりませんでした。
                </p>
                <p style="color: #999; line-height: 1.8;">
                    お問い合わせ番号（トークン）が正しいかご確認ください。<br>
                    または、お問い合わせが削除されている可能性があります。
                </p>
            </div>
        </div>
    </section>

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
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Contact') }}" class="node-head-text">お問い合わせ</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
            </section>
        </div>
    </section>
@endsection

