<x-mail::message>
# メールアドレス変更の確認

{{ $user->name }} さん

メールアドレス変更のリクエストを受け付けました。

15分以内に次のボタンをクリックして変更を確定してください。

<x-mail::button :url="$verificationUrl">
メールアドレス変更を確定する
</x-mail::button>

このボタンがクリックできない場合は、以下のURLをブラウザにコピーしてアクセスしてください。

{{ $verificationUrl }}

このメールに心当たりがない場合は、リンクを開かずこのメールを破棄してください。  
何度もメールが送られてくる場合は、当サイトの問い合わせフォームよりご連絡ください。

Thanks,<br>
{{ config('app.name') }}<br>
<a href="https://horrorgame.net/">https://horrorgame.net/</a>
</x-mail::message>


