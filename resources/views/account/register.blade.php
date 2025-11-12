@extends('layout')

@section('title', '新規登録')
@section('current-node-title', '新規登録')

@section('nodes')

    <section class="node" id="register-form-node">
        <div class="node-head">
            <h2 class="node-head-text">新規登録フォーム</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            @error('email')
                <div class="alert alert-warning my-3">
                    {!! nl2br(e($message)) !!}
                </div>
            @enderror
            <form id="account-register-form" action="{{ route('Account.Register.Store') }}" method="POST" data-child-only="0">
                @csrf
                <div class="form-group mb-3">
                    <label for="email" class="form-label">メールアドレス</label>
                    <input type="email" name="email" class="form-control" id="email" placeholder="メールアドレス" value="{{ old('email') }}" required autofocus>
                </div>
                <div class="form-group mb-3">
                    <label for="name" class="form-label">お名前</label>
                    <input type="text" name="name" class="form-control" id="name" placeholder="お名前" value="{{ old('name') }}">
                    @error('name')
                        <div class="alert alert-warning my-3">
                            {{ $message }}
                        </div>
                    @enderror
                </div>
                <div class="form-group" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-success">新規登録</button>
                </div>
            </form>

            <p>
                すでにアカウントをお持ちの方は<a href="{{ route('Account.Login') }}">こちら</a>からログインしてください。
            </p>
        </div>
    </section>

    @include('common.shortcut')
@endsection

