@extends('layout')

@section('title', 'パスワード設定')
@section('current-node-title', 'パスワード設定')

@section('nodes')
    <section class="node" id="password-set-form-node">
        <div class="node-head">
            <h2 class="node-head-text">パスワード設定</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p class="alert alert-info">
                GitHubなどで登録されたアカウントは、パスワードを設定することでメールアドレスとパスワードでもログインできるようになります。
            </p>

            @if (session('success'))
                <div class="alert alert-success mt-3">
                    {{ session('success') }}
                </div>
            @endif

            <form action="{{ route('User.MyNode.PasswordSet.Update') }}" method="POST">
                @csrf
                <div class="form-group mb-3">
                    <label for="password" class="form-label">パスワード</label>
                    <input type="password" name="password" id="password" class="form-control" required>
                    @error('password')
                        <div class="alert alert-warning mt-3">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <div class="form-group mb-3">
                    <label for="password_confirmation" class="form-label">パスワード（確認）</label>
                    <input type="password" name="password_confirmation" id="password_confirmation" class="form-control" required>
                </div>

                <div class="form-group" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-success">設定</button>
                </div>
            </form>
        </div>
    </section>
    @include('common.shortcut')
@endsection
