@extends('layout')

@section('title', 'ログイン')
@section('current-node-title', 'ログイン')

@section('nodes')

    <section class="node" id="login-form-node">
        <div class="node-head">
            <h2 class="node-head-text">ログインフォーム</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <form id="login-form" action="{{ route('Account.Auth') }}" method="POST" data-child-only="0">
                @csrf
                <div class="form-group mb-3">
                    <label for="email" class="form-label">メールアドレス</label>
                    <input type="email" name="email" class="form-control" id="email" placeholder="メールアドレス" value="{{ old('email') }}" required autofocus>
                </div>
                <div class="form-group mb-3">
                    <label for="password" class="form-label">パスワード</label>
                    <input type="password" name="password" class="form-control" id="password" placeholder="パスワード" required>
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" name="remember_me" value="1" id="rememberMe">
                    <label class="form-check-label" for="rememberMe">
                        ログイン状態を保持する
                    </label>
                </div>
                <div class="form-group" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-success">ログイン</button>
                </div>
            </form>
        
            @error('login')
                <div class="alert alert-danger mt-3">
                    {{ $message }}
                </div>
            @enderror

            @if(session('success'))
                <div class="alert alert-success mt-3">
                    {{ session('success') }}
                </div>
            @endif

            @if(session('error'))
                <div class="alert alert-danger mt-3">
                    {{ session('error') }}
                </div>
            @endif

            <p>
                アカウントをお持ちでない方は<a href="{{ route('Account.Register') }}">こちら</a>から新規登録してください。
            </p>
        </div>
    </section>

    @include('common.shortcut')
@endsection

