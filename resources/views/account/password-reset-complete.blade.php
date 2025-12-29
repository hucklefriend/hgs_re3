@extends('layout')

@section('title', 'パスワードリセット')
@section('current-node-title', 'パスワードリセット')

@section('nodes')

    <section class="node" id="password-reset-complete-form-node">
        <div class="node-head">
            <h2 class="node-head-text">パスワード変更フォーム</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <div class="mb-3">
                <p>メールアドレス: <strong>{{ $email }}</strong></p>
            </div>
            <form id="password-reset-complete-form" action="{{ route('Account.PasswordReset.Complete.Store', ['token' => $token]) }}" method="POST" data-child-only="0">
                @csrf
                <div class="form-group mb-3">
                    <label for="password" class="form-label">新しいパスワード</label>
                    <input type="password" name="password" class="form-control" id="password" placeholder="パスワード（8文字以上）" required autofocus>
                    @error('password')
                        <div class="text-danger mt-1">{{ $message }}</div>
                    @enderror
                </div>
                <div class="form-group" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-success">パスワードを変更</button>
                </div>
            </form>
        
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
        </div>
    </section>

    @include('common.shortcut')
@endsection

