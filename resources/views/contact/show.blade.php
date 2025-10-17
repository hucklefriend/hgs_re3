@extends('layout')

@section('title', 'お問い合わせ | ホラーゲームネットワーク')
@section('current-node-title', 'お問い合わせ')
@section('current-node-content')
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
    <div style="line-height: 1.6;font-size: 13px;">
        <span style="padding: 3px 5px; background-color: {{ $contact->status->value === 0 ? '#ff9800' : ($contact->status->value === 1 ? '#2196F3' : ($contact->status->value === 2 ? '#4CAF50' : '#999')) }}; color: white; border-radius: 3px;">
            {{ $contact->status->label() }}
        </span>
    </div>
    <p>{{ $contact->category }}</p>
    <p>
        {!! nl2br(e($contact->masked_message)) !!}
    </p>

    <div style="line-height: 1.6;font-size: 13px;">
        お名前：{{ $contact->name }}<br>
        受付日時：{{ $contact->created_at->format('Y年m月d日 H:i') }}
    </div>
@endsection


@section('nodes')
    @if($contact->status->value === 0)
        <section class="node" id="cancel-node">
            <div class="node-head">
                <h2 class="node-head-text">取り消し</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <p style="margin-bottom: 20px; color: #ffffff;">
                    未対応のお問い合わせは取り消すことができます。<br>
                    取り消すと、このお問い合わせは表示されなくなります。
                </p>
                <form method="POST" action="{{ route('Contact.Cancel', ['token' => $contact->token]) }}">
                    @csrf
                    <div>
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


    <section class="node tree-node" id="response-node">
        <div class="node-head">
            <h2 class="node-head-text">返信</h2>
            <span class="node-pt">●</span>
        </div>

        @if($responses->count() === 0)
        <div class="node-content basic" id="response-empty">
            <p style="color: #CCC;">返信はありません。</p>
        </div>
        @endif
        <div class="node-content tree" id="response-node-content">
            @if($responses->count() > 0)
                @foreach($responses as $response)
                <section class="node" id="response-form-node">
                    <div class="node-head">
                        <h3 class="node-head-text">
                            {{ $response->responder_name }}
                            {{ $response->created_at->format('Y年m月d日 H:i') }}
                        </h3>
                        <span class="node-pt">●</span>
                    </div>
                    <div class="node-content basic">
                        {!! nl2br(e($response->masked_message)) !!}
                    </div>
                </section>
                @endforeach
            @endif
            <section class="node" id="response-form-node">
                <div class="node-head">
                    <h3 class="node-head-text">返信を投稿</h3>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content basic" id="response-form">
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

                    <form method="POST" action="{{ route('Contact.StoreResponse', ['token' => $contact->token]) }}" data-child-only="1">
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
                <section class="node link-node">
                    <div class="node-head">
                        <a href="{{ route('Contact') }}" class="node-head-text">お問い合わせ</a>
                        <span class="node-pt main-node-pt">●</span>
                    </div>
                </section>

                
            
                @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
                <section class="node link-node">
                    <div class="node-head">
                        <a href="{{ route('Admin.Manage.Contact.Show', $contact) }}" class="node-head-text" rel="external">管理</a>
                        <span class="node-pt">●</span>
                    </div>
                </section>
                @endif
            </div>
        </section>
    </section>


@endsection

