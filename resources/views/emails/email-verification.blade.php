<x-mail::message>
# メールアドレスの確認

{{ $user->name }} さん

この度はご登録いただき、ありがとうございます。

メールアドレスの確認を行うため、以下のボタンをクリックしてください。

**10分以内に確認を行わない場合、アカウントは自動的に無効化されます。**

<x-mail::button :url="$verificationUrl">
メールアドレスを確認する
</x-mail::button>

このボタンがクリックできない場合は、以下のURLをブラウザにコピーしてアクセスしてください。

{{ $verificationUrl }}

このメールに心当たりがない場合は、このメールを無視してください。

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
