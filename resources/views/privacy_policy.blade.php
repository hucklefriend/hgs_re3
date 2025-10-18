@extends('layout')

@section('title', 'プライバシーポリシー')
@section('current-node-title', 'プライバシーポリシー')


@section('current-node-content')
    <p style="font-size: 13px; padding-bottom: 30px;">
        最終改定日：2025年10月16日
    </p>
@endsection

@section('nodes')
    <section class="node">
        <div class="node-head">
            <span class="node-head-text">Intended for users in Japan only</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                当サイトは日本専用サイトです。<br>
                日本国の法律に従い、日本語以外でのサービス提供やサポートは行っておりません。
            </p>
            <p>
                This website is exclusively for users in Japan.<br>
                In compliance with Japanese law, we do not provide services or support in languages other than Japanese.
            </p>
        </div>
    </section>


    <section class="node">
        <div class="node-head">
            <span class="node-head-text">アクセスログ</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                当サイトでは、サーバーの運用・保守およびセキュリティ確保のため、アクセスログを記録しています。<br>
                記録される情報には、IPアドレス、アクセス日時、閲覧ページ、ブラウザの種類などが含まれます。<br>
                これらの情報は個人を特定する目的では使用せず、サイトの改善やセキュリティ対策のためにのみ利用します。<br>
                また、法令に基づく場合を除き、これらの情報を第三者へ提供することはありません。<br>
                アクセスログは一定期間（おおよそ6か月以内）保管した後、順次削除しています。
            </p>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">個人情報の取得</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                現在ユーザー登録機能を停止しているため、個人情報は取得していません。<br>
                休止前のHGS/HGNへ登録いただいていた方のメールアドレスやSNSのID情報は現在も保持しており、
                ユーザー登録機能再開時にそのまま利用してもらえる予定です。<br>
                その際に取得する個人情報については、後日プライバシーポリシーに記載します。
            </p>
        </div>
    </section>

    {{--
    <section>
    <h2><i class="bi bi-octagon"></i>メールアドレスの取得</h2>
        <p>
            メール・パスワード認証を利用される場合に限り、メールアドレスを取得しています。<br>
            メールアドレスは以下の用途に利用しています。
        </p>
        <ul>
            <li>メール・パスワード認証の登録の際にメールを送ってます。</li>
            <li>メール・パスワード認証でログインする場合、メールアドレスの入力が必要です。</li>
            <li>パスワードを忘れた場合に、再発行のためメールアドレスの入力が必要です。</li>
            <li>パスワードを忘れた場合に、再発行のメールをお送りしています。</li>
        </ul>
        <p>
            上記以外のことでメールアドレスの入力を求めたり、メールをお送りすることはありません。<br>
            連絡事項がある場合は、当サイト内のメッセージ機能でご連絡します。
        </p>
    </section>
    <section>
        <h2><i class="bi bi-octagon"></i>外部サービス</h2>
        <p>
            当サイトでは、外部サービスを使ってログインや新規登録を行えます。<br>
            外部サービスを利用される場合、アカウント情報を取得しています。<br>
            利用できるサービスは以下の通りです。
        </p>
        <ul>
            <li><a href="https://www.facebook.com/" target="_blank">Facebook <i class="fas fa-sign-out-alt"></i></a></li>
            <li><a href="https://github.com/" target="_blank">GitHub <i class="fas fa-sign-out-alt"></i></a></li>
        </ul>

        <p>
            取得している情報は以下の通りです。
        </p>
        <ul>
            <li>外部サイト内でのユーザーID</li>
            <li>名前(ニックネームにあたるもの)</li>
            <li>OAuth認証に必要なトークンおよびシークレットトークン</li>
        </ul>
        <p>
            現在のところ、いずれのサービスにおいても新規登録とログインでのみアカウント情報の取得・利用を行っております。
        </p>
        <p>
            ユーザー設定の画面で連携情報の削除を行うことができます。<br>
            当サイト内のデータが削除されるだけで、外部サービス側には設定が残っていますので、外部サービス側での連携解除処理も行ってください。
        </p>
    </section>
    --}}

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">個人情報の安全管理措置</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                当サイトでは、取得した個人情報を適切に管理し、漏えい・改ざん・紛失等を防止するため、必要かつ合理的な安全管理措置を講じています。<br>
                通信にはSSLによる暗号化を採用し、通信経路上での盗聴や改ざんを防止しています。<br>
                当サイトはLaravelによって構築されており、サーバーにはアクセス制限および不正アクセス対策を実施しています。<br>
                過去に取得したメールアドレス等の個人情報についても、安全なサーバー環境で適切に保管し、外部への漏えい防止に努めています。<br>
                個人情報は、利用目的の達成に必要な範囲内でのみ取り扱い、不要となった場合には適切な方法で削除または破棄いたします。
            </p>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">個人情報の開示・訂正・削除について</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                当サイトが保有する個人情報について、ご本人から開示・訂正・削除等のご請求があった場合には、本人確認の上、合理的な範囲で対応いたします。<br>
                ご請求は当サイトの<a href="{{ route('Contact') }}" rel="internal">問い合わせ</a>よりご連絡ください。<br>
                メール等での個別対応は行っておりません。<br>
                原則として30日以内に対応いたしますが、法令等に基づき削除できない場合や、対応に時間を要する場合には、その旨をお知らせいたします。
            </p>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">Cookieの利用</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                当サイトでは、Cookieを使用しています。<br>
                これは、ログイン状態の維持や各種パラメーターの保持のために利用しています。
            </p>
            <p>
                また、広告配信および成果測定のため、第三者であるアフィリエイトサービス提供事業者のプログラムを利用しています。<br>
                これにより、当該事業者がCookie等を通じてユーザーのアクセス情報を取得する場合があります。
            </p>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">アフィリエイト</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                下記のアフィリエイトに参加しています。<br>
                当サイト内において、アフィリエイトの画像の表示や、アフィリエイトサイトの商品ページおよび商品検索ページへのリンクしている部分があります。
            </p>
            <ul>
                <li><a href="https://affiliate.amazon.co.jp/" target="_blank">Amazon.co.jpアソシエイト</a></li>
                <li><a href="https://affiliate.dmm.com/" target="_blank">DMM アフィリエイト</a></li>
            </ul>
        </div>
    </section>


    {{--
    <section>
        <h2><i class="bi bi-octagon"></i>年齢確認</h2>
        <p>
            ユーザー登録後、18歳以上かどうかを設定できる項目があります。<br>
            こちらの設定は必須ではありませんが、R-18ゲームや関連コンテンツの表示のために利用しています。<br>
        </p>
        <ul>
            <li>当サイトのユーザーとして登録している</li>
            <li>ユーザーの設定で、「18歳以上で、かつ暴力または性的な表現があっても問題ありません」を有効にしている</li>
        </ul>
        <p>
            また、R-18にも2種類あり、それぞれ以下のように表記しています。
        </p>
        <ul>
            <li>
                R-18Z: CERO-ZやSteamで成人指定されている、いわゆるZ指定ゲーム。<br>
                また過激なグロテスク表現のある関連商品や二次創作。<br>
                年齢設定をしていない場合、画面上に警告文が表示されます。
            </li>
            <li>
                R-18A: アダルトゲーム、いわゆるエロゲ。<br>
                また、性表現がある関連商品や二次創作。<br>
                年齢設定をしていない場合、パッケージ画像や二次創作が非表示となりレビューや二次創作の投稿が行えません。<br>
                ただし、全年齢版など表現規制版のパッケージがある場合はレビューや二次創作の投稿は行えます。
            </li>
        </ul>
    </section>
    --}}




    <section class="node">
        <div class="node-head">
            <span class="node-head-text">免責事項</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                当サイトで掲載している画像等の著作権等は権利所有者のものです。
            </p>
            <p>
                当サイトから他のサイトに移動された場合、移動先サイトで提供されるサービス等について一切の責任を負いません。
            </p>
        </div>
    </section>


    <section class="node">
        <div class="node-head">
            <span class="node-head-text">問い合わせ</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                個人情報の削除については、<a href="{{ route('Contact') }}" rel="internal">問い合わせ</a>よりご連絡ください。<br>
            </p>
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
        </div>
    </section>
@endsection
