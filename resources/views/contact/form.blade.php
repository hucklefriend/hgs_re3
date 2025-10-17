@extends('layout')

@section('title', 'お問い合わせ | ホラーゲームネットワーク')
@section('current-node-title', 'お問い合わせ')

@section('nodes')

    <section class="node" id="contact-form-node">
        <div class="node-head">
            <h2 class="node-head-text">お問い合わせフォーム</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                お問い合わせは下記のフォームからお願いします。<br>
                内容を確認次第、ご連絡させていただきます。
            </p>

            <div style="background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #1976D2;">💡 個人情報保護機能について</strong>
                <p style="margin: 10px 0 0 0; line-height: 1.6;">
                    メールアドレスやSNSのIDなどの個人情報を送信したい場合は、<code style="background-color: #fff; padding: 2px 6px; border-radius: 3px;">/*</code>と<code style="background-color: #fff; padding: 2px 6px; border-radius: 3px;">*/</code>で囲んでください。<br>
                    囲まれた部分は管理者にのみ表示され、お問い合わせ確認画面では<strong>■で伏せ字</strong>として表示されます。
                </p>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                    <strong>例：</strong> 私のメールアドレスは /*example@example.com*/ です。<br>
                    → 確認画面では「私のメールアドレスは <strong>■■■■■■■■■■■■■■■■■■■■■</strong> です。」と表示されます。
                </p>
            </div>

            @if ($errors->any())
                <div class="alert alert-danger" style="background-color: #fee; border: 1px solid #f00; padding: 15px; margin: 15px 0; border-radius: 4px;">
                    <ul style="margin: 0; padding-left: 20px;">
                        @foreach ($errors->all() as $error)
                            <li style="color: #c00;">{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form id="contact-form" method="POST" action="{{ route('SendContact') }}" style="margin-top: 20px;" rel="internal" data-child-only="0" onsubmit="return false;">
                @csrf

                <div style="margin-bottom: 20px;">
                    <label for="name" style="display: block; margin-bottom: 5px; font-weight: bold;">
                        お名前 <span style="color: #c00;">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value="{{ old('name') }}" 
                        required
                        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"
                    >
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="category" style="display: block; margin-bottom: 5px; font-weight: bold;">
                        カテゴリー
                    </label>
                    <select 
                        id="category" 
                        name="category"
                        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"
                    >
                        <option value="">選択してください</option>
                        <option value="不具合報告" {{ old('category') === '不具合報告' ? 'selected' : '' }}>不具合報告</option>
                        <option value="ゲーム情報の誤り" {{ old('category') === 'ゲーム情報の誤り' ? 'selected' : '' }}>ゲーム情報の誤り</option>
                        <option value="機能要望" {{ old('category') === '機能要望' ? 'selected' : '' }}>機能要望</option>
                        <option value="その他" {{ old('category') === 'その他' ? 'selected' : '' }}>その他</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="subject" style="display: block; margin-bottom: 5px; font-weight: bold;">
                        件名
                    </label>
                    <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value="{{ old('subject') }}"
                        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"
                    >
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="message" style="display: block; margin-bottom: 5px; font-weight: bold;">
                        お問い合わせ内容 <span style="color: #c00;">*</span>
                    </label>
                    <textarea 
                        id="message" 
                        name="message" 
                        rows="10" 
                        required
                        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; resize: vertical;"
                    >{{ old('message') }}</textarea>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <button 
                        type="submit"
                        style="background-color: #4CAF50; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;"
                    >
                        送信する
                    </button>
                </div>
            </form>
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
            
        
            @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Admin.Manage.Contact') }}" class="node-head-text" rel="external">管理</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endif
        </div>
    </section>
@endsection

