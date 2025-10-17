@extends('layout')

@section('title', 'お問い合わせ完了 | ホラーゲームネットワーク')
@section('current-node-title', 'お問い合わせ完了')

@section('nodes')

    <section class="node">
        <div class="node-head">
            <h2 class="node-head-text">送信完了</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p style="font-size: 18px; text-align: center; margin: 30px 0 20px 0;">
                お問い合わせありがとうございました。<br>
                内容を確認次第、ご連絡させていただきます。
            </p>

            <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border: 3px solid #ff5722; border-radius: 8px;">
                <p style="font-size: 18px; font-weight: bold; color: #ff5722; margin: 0 0 15px 0; text-align: center;">
                    ⚠️ 重要：必ずこのURLを保存してください ⚠️
                </p>
                <p style="line-height: 1.8; margin-bottom: 15px;">
                    お問い合わせ内容や返信を確認するには、下記のURLが必要です。<br>
                    <strong style="color: #d32f2f;">メール通知は行いませんので、必ずこのURLをブックマークするか、メモしてください。</strong><br>
                    このURLを失うと、お問い合わせ内容を確認できなくなります。
                </p>
                <div style="background-color: white; padding: 15px; border: 2px solid #ff9800; border-radius: 4px; margin-bottom: 15px;">
                    <p style="font-weight: bold; margin-bottom: 5px; color: #666;">確認用URL:</p>
                    <p style="word-break: break-all; font-family: monospace; font-size: 14px; margin: 0; color: #2196F3;">
                        {{ route('Contact.Show', ['token' => $contact->token]) }}
                    </p>
                </div>
                <div style="text-align: center;">
                    <a href="{{ route('Contact.Show', ['token' => $contact->token]) }}" style="display: inline-block; background-color: #ff5722; color: white; padding: 15px 40px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                        📌 この問い合わせを確認する（今すぐブックマーク推奨）
                    </a>
                </div>
            </div>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <h2 class="node-head-text">お問い合わせ内容</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <dl style="line-height: 1.8;">
                <dt style="font-weight: bold; margin-top: 15px;">お名前</dt>
                <dd style="margin-left: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
                    {{ $contact->name }}
                </dd>

                @if($contact->category)
                    <dt style="font-weight: bold; margin-top: 15px;">カテゴリー</dt>
                    <dd style="margin-left: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
                        {{ $contact->category }}
                    </dd>
                @endif

                @if($contact->subject)
                    <dt style="font-weight: bold; margin-top: 15px;">件名</dt>
                    <dd style="margin-left: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
                        {{ $contact->masked_subject }}
                    </dd>
                @endif

                <dt style="font-weight: bold; margin-top: 15px;">お問い合わせ内容</dt>
                <dd style="margin-left: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px; white-space: pre-wrap;">{{ $contact->masked_message }}</dd>

                <dt style="font-weight: bold; margin-top: 15px;">受付日時</dt>
                <dd style="margin-left: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
                    {{ $contact->created_at->format('Y年m月d日 H:i') }}
                </dd>

                <dt style="font-weight: bold; margin-top: 15px;">お問い合わせ番号</dt>
                <dd style="margin-left: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px; font-family: monospace;">
                    {{ $contact->token }}
                </dd>
            </dl>
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

