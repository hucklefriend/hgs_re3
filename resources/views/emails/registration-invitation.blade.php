<x-mail::message>
# 新規登録のご案内

この度は{{ config('app.name') }}に登録いただき、ありがとうございます。

現在は仮登録状態です。  
以下のボタンをクリックして、必要事項を入力し登録を完了してください。

**1時間以内に登録を完了しない場合、リンクは無効になります。**

<x-mail::button :url="$registrationUrl">
登録用ページへ
</x-mail::button>

このボタンがクリックできない場合は、以下のURLをブラウザにコピーしてアクセスしてください。

{{ $registrationUrl }}

このメールに心当たりがない場合は、このメールを無視してください。  
何度もメールが送られてくる場合は、当サイトの問い合わせフォームよりご連絡ください。

Thanks,<br>
{{ config('app.name') }}<br>
<a href="https://horrorgame.net/">https://horrorgame.net/</a>
</x-mail::message>

