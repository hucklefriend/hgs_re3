@extends('layout')

@section('title', '新規登録')
@section('current-node-title', '新規登録')

@section('nodes')

    <section class="node" id="complete-register-form-node">
        <div class="node-head">
            <h2 class="node-head-text">新規登録フォーム</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <div class="mb-3">
                <p>メールアドレス: <strong>{{ $email }}</strong></p>
            </div>
            <form id="complete-register-form" action="{{ route('Account.Register.Complete.Store', ['token' => $token]) }}" method="POST" data-child-only="0">
                @csrf
                <div class="form-group mb-3">
                    <label for="name" class="form-label">名前</label>
                    <input type="text" name="name" class="form-control" id="name" placeholder="名前" value="{{ old('name') }}" required autofocus>
                    @error('name')
                        <div class="text-danger mt-1">{{ $message }}</div>
                    @enderror
                </div>
                <div class="form-group mb-3">
                    <label for="password" class="form-label">パスワード</label>
                    <input type="password" name="password" class="form-control" id="password" placeholder="パスワード（8文字以上）" required>
                    @error('password')
                        <div class="text-danger mt-1">{{ $message }}</div>
                    @enderror
                </div>
                <div class="form-group" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-success">登録を完了する</button>
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

