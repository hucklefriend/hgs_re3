@extends('layout')

@section('content')
    <div class="node-list">
        <div class="node node-center" style="margin-top: 10rem;margin-bottom: 10rem;">
            <div class="text-node link-node-center">
                <div id="cookie_confirm">
                    <p>
                        これより先、ログイン状態維持のためCookieを使用します。<br>
                        個人情報保護の観点からCookieの利用には同意が必要となっています。<br>
                        詳しくはプライバシーポリシーを見てください。<br>
                        同意いただけない場合はログインできません。<br>
                    </p>
                    <button>Cookieの利用を許可する</button>
                </div>
                <form method="POST">

                </form>
            </div>
        </div>
    </div>
@endsection
