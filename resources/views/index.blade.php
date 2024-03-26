@extends('layout')

@section('content')
    <div id="title-node">
        <h1>HorrorGame Network</h1>
    </div>
    <p class="text-node">
        ホラーゲームの最新ニュースや新旧ホラーゲームの詳しい情報、ユーザーによるレビューを見られます。<br>
        さらにユーザー登録すればレビューや二次創作など自分の怖い！好き！を発信できます。
    </p>
    <div class="node-list">
        <div class="node">
            <div class="link-node">
                Sign In / Sign Up
            </div>
        </div>
        <div class="node">
            <div class="link-node">
                HorrorGame Search
            </div>
        </div>
        <div class="node">
            <div class="link-node">
                News
            </div>
        </div>
        <div class="node">
            <div class="link-node">
                Information
            </div>
        </div>
        <div class="node">
            <div class="link-node">
                About
            </div>
        </div>
        <div class="node">
            <div class="link-node">
                <a href="{{ route('privacy') }}">Privacy Policy</a>
            </div>
        </div>
        <div class="node">
            <div class="link-node">
                Site Map
            </div>
        </div>
    </div>
@endsection
