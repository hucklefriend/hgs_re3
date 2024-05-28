@extends('layout')

@section('title', 'Suspend.hgn')

@section('content')
    <div class="node node-center" style="margin-top: 10rem;margin-bottom: 10rem;">
        <div class="link-node link-node-center">
            <h1>HorrorGame Network</h1>

            <p style="margin-top: 1.5rem;margin-bottom: 0.5rem;">
                現在、休止中です。<br>
                再開に向け頑張って開発しています。<br>
                時々、様子を見に来てくれると嬉しいです。
            </p>
        </div>
    </div>

    <footer style="margin: 50px 0;">
        <div class="node node-center">
            <div class="text-node">
                &copy; 2003-{{ date('Y') }} ホラーゲームネットワーク
            </div>
        </div>
    </footer>
@endsection
