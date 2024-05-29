@extends('layout')

@section('content')
    <div class="node-list">
        <div class="node">
            <div class="text-node">
                <p>
                    以下の点について同意いただける場合のみ、新規登録を行ってください。
                </p>
                <ul>
                    <li>個人運営のため、サポート等が行えない場合があります</li>
                    <li>プライバシーポリシー</li>
                </ul>
            </div>
        </div>


        <div class="node">
            <div class="text-node">
                <p>
                    以下の点について同意いただける場合のみ、新規登録を行ってください。
                </p>
                <ul>
                    <li>個人運営のためサポートが行えない場合があります</li>
                    <li>プライバシーポリシー</li>
                </ul>
            </div>
        </div>

        <div class="node node-center" style="margin-top: 10rem;margin-bottom: 10rem;">
            <div class="text-node link-node-center">
                <div id="cookie_confirm">
                    <p>
                        これより先はCookieを使用します。<br>
                        ログインの維持に必要なため同意いただけない場合はユーザー登録を行えません。<br>
                    </p>
                    <button>Cookieの利用を許可する</button>
                </div>
                <form method="POST">

                </form>
            </div>
        </div>
    </div>
@endsection
