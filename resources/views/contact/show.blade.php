@extends('layout')

@section('title', 'お問い合わせ内容 | ホラーゲームネットワーク')
@section('current-node-title', 'お問い合わせ内容')

@section('nodes')

    @if (session('success'))
        <section class="node">
            <div class="node-content basic">
                <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; margin: 15px 0; border-radius: 4px;">
                    {{ session('success') }}
                </div>
            </div>
        </section>
    @endif

    @if (session('error'))
        <section class="node">
            <div class="node-content basic">
                <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; margin: 15px 0; border-radius: 4px;">
                    {{ session('error') }}
                </div>
            </div>
        </section>
    @endif

    @if($contact->status->value === 2)
        <section class="node">
            <div class="node-content basic">
                <div style="background-color: #fff9c4; border: 2px solid #fbc02d; padding: 20px; margin: 0; border-radius: 8px;">
                    <p style="font-size: 16px; font-weight: bold; color: #f57f17; margin: 0 0 10px 0;">
                        ⚠️ 対応完了のお知らせ
                    </p>
                    <p style="margin: 0; line-height: 1.6; color: #333;">
                        このお問い合わせへの対応は完了したものとしています。<br>
                        特に追加の投稿がない場合、本問い合わせは<strong>2週間後に自動でクローズ</strong>され、閲覧できなくなります。<br>
                        追加でご連絡したいことがある場合は、下記の返信フォームからご投稿ください。
                    </p>
                </div>
            </div>
        </section>
    @endif

    <section class="node">
        <div class="node-head">
            <h2 class="node-head-text">お問い合わせ内容</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <dl style="line-height: 1.8;">
                <dt style="font-weight: bold; margin-top: 15px;">お問い合わせ番号</dt>
                <dd style="margin-left: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px; font-family: monospace;">
                    {{ $contact->token }}
                </dd>

                <dt style="font-weight: bold; margin-top: 15px;">ステータス</dt>
                <dd style="margin-left: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
                    <span style="padding: 5px 15px; background-color: {{ $contact->status->value === 0 ? '#ff9800' : ($contact->status->value === 1 ? '#2196F3' : ($contact->status->value === 2 ? '#4CAF50' : '#999')) }}; color: white; border-radius: 3px;">
                        {{ $contact->status->label() }}
                    </span>
                </dd>

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
            </dl>
        </div>
    </section>

    @if($responses->count() > 0)
        <section class="node">
            <div class="node-head">
                <h2 class="node-head-text">返信履歴</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                @foreach($responses as $response)
                    <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid {{ $response->responder_type->value === 0 ? '#4CAF50' : '#2196F3' }}; background-color: #f9f9f9; border-radius: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <div>
                                <span style="font-weight: bold; color: {{ $response->responder_type->value === 0 ? '#4CAF50' : '#2196F3' }};">
                                    @if($response->responder_type->value === 0)
                                        👤 {{ $response->responder_name ?? '管理者' }}
                                    @elseif($response->responder_type->value === 1)
                                        💬 {{ $response->responder_name ?? 'ユーザー' }}
                                    @else
                                        🤖 システム
                                    @endif
                                </span>
                                <span style="margin-left: 10px; padding: 3px 8px; background-color: {{ $response->responder_type->value === 0 ? '#4CAF50' : '#2196F3' }}; color: white; font-size: 12px; border-radius: 3px;">
                                    {{ $response->responder_type->label() }}
                                </span>
                            </div>
                            <span style="color: #666; font-size: 14px;">
                                {{ $response->created_at->format('Y年m月d日 H:i') }}
                            </span>
                        </div>
                        <div style="white-space: pre-wrap; line-height: 1.6;">{{ $response->masked_message }}</div>
                    </div>
                @endforeach
            </div>
        </section>
    @else
        <section class="node">
            <div class="node-head">
                <h2 class="node-head-text">返信履歴</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <p style="color: #999; text-align: center; padding: 30px;">まだ返信がありません。</p>
            </div>
        </section>
    @endif

    <section class="node">
        <div class="node-head">
            <h2 class="node-head-text">追加の返信を投稿</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p style="margin-bottom: 20px;">
                追加で情報を送信したい場合は、こちらから返信を投稿できます。
            </p>

            <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #1976D2;">💡 個人情報保護機能について</strong>
                <p style="margin: 10px 0 0 0; line-height: 1.6; font-size: 14px;">
                    メールアドレスや電話番号などの個人情報は、<code style="background-color: #fff; padding: 2px 6px; border-radius: 3px;">/*</code>と<code style="background-color: #fff; padding: 2px 6px; border-radius: 3px;">*/</code>で囲むことで、管理者にのみ表示され、確認画面では<strong>■で伏せ字</strong>として表示されます。
                </p>
            </div>

            @if ($errors->any())
                <div style="background-color: #fee; border: 1px solid #f00; padding: 15px; margin: 15px 0; border-radius: 4px;">
                    <ul style="margin: 0; padding-left: 20px;">
                        @foreach ($errors->all() as $error)
                            <li style="color: #c00;">{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('Contact.StoreResponse', ['token' => $contact->token]) }}">
                @csrf

                <div style="margin-bottom: 20px;">
                    <label for="responder_name" style="display: block; margin-bottom: 5px; font-weight: bold;">
                        お名前 <span style="color: #c00;">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="responder_name" 
                        name="responder_name" 
                        value="{{ old('responder_name', $contact->name) }}" 
                        required
                        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"
                    >
                    <p style="font-size: 12px; color: #666; margin-top: 5px;">※ 元のお問い合わせ時のお名前がデフォルトで入力されています。</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="message" style="display: block; margin-bottom: 5px; font-weight: bold;">
                        返信内容 <span style="color: #c00;">*</span>
                    </label>
                    <textarea 
                        id="message" 
                        name="message" 
                        rows="8" 
                        required
                        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; resize: vertical;"
                    >{{ old('message') }}</textarea>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <button 
                        type="submit"
                        style="background-color: #2196F3; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;"
                    >
                        返信を投稿
                    </button>
                </div>
            </form>
        </div>
    </section>

    @if($contact->status->value === 0)
        <section class="node">
            <div class="node-head">
                <h2 class="node-head-text">お問い合わせを取り消す</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <p style="margin-bottom: 20px; color: #666;">
                    まだ対応されていない問い合わせは取り消すことができます。<br>
                    取り消すと、この問い合わせは表示されなくなります。
                </p>
                <form method="POST" action="{{ route('Contact.Cancel', ['token' => $contact->token]) }}" onsubmit="return confirm('本当にこの問い合わせを取り消しますか？\n取り消し後は元に戻せません。');">
                    @csrf
                    <div style="text-align: center;">
                        <button 
                            type="submit"
                            style="background-color: #f44336; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;"
                        >
                            お問い合わせを取り消す
                        </button>
                    </div>
                </form>
            </div>
        </section>
    @endif

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
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Contact') }}" class="node-head-text">お問い合わせ</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
            </section>
        </div>
    </section>
@endsection

