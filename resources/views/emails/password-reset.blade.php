<x-mail::message>
# パスワードリセットのご案内

{{ config('app.name') }}のパスワードリセットをご希望いただきありがとうございます。

以下のボタンをクリックして、新しいパスワードを設定してください。

**15分以内にパスワードを変更しない場合、リンクは無効になります。**

<x-mail::button :url="$resetUrl">
パスワード変更ページへ
</x-mail::button>

このボタンがクリックできない場合は、以下のURLをブラウザにコピーしてアクセスしてください。

{{ $resetUrl }}

このメールに心当たりがない場合は、このメールを無視してください。  
何度もメールが送られてくる場合は、当サイトの問い合わせフォームよりご連絡ください。

Thanks,<br>
{{ config('app.name') }}<br>
<a href="https://horrorgame.net/">https://horrorgame.net/</a>
</x-mail::message>

