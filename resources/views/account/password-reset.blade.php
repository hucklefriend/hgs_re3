@extends('layout')

@section('title', 'パスワードリセット')
@section('current-node-title', 'パスワードリセット')

@section('nodes')

    <section class="node" id="password-reset-form-node">
        <div class="node-head">
            <h2 class="node-head-text">パスワードリセットフォーム</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            @if(session('error'))
                <div class="alert alert-danger mt-3">
                    {{ session('error') }}
                </div>
            @endif

            @error('email')
                <div class="alert alert-warning my-3">
                    {!! nl2br(e($message)) !!}
                </div>
            @enderror

            <p>
                パスワードをリセットするメールアドレスを入力してください。<br>
                入力されたメールアドレスにパスワードリセット用のリンクを送信します。
            </p>

            <form id="password-reset-form" action="{{ route('Account.PasswordReset.Store') }}" method="POST" data-child-only="0">
                @csrf
                <div class="form-group mb-3">
                    <label for="email" class="form-label">メールアドレス</label>
                    <input type="email" name="email" class="form-control" id="email" placeholder="メールアドレス" value="{{ old('email') }}" required autofocus>
                </div>
                <div class="form-group" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-success">送信</button>
                </div>
            </form>
        </div>
    </section>

    @include('common.shortcut')
@endsection

