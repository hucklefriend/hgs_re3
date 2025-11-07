@extends('layout')

@section('title', '退会')
@section('current-node-title', '退会')

@section('nodes')
    <section class="node" id="withdraw-form-node">
        <div class="node-head">
            <h2 class="node-head-text">退会</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            @if ($user->withdrawn_at)
                <div class="alert alert-warning mt-3">
                    すでに退会手続きが完了しています（退会日時: {{ $user->withdrawn_at->format('Y-m-d H:i') }}）。
                </div>
            @else
                <p>
                    退会するとログインできなくなります。<br>
                    本人確認のためパスワードを入力してください。
                </p>

                <form action="{{ route('User.MyNode.Withdraw.Store') }}" method="POST">
                    @csrf
                    <div class="form-group mb-3">
                        <label for="password" class="form-label">パスワード</label>
                        <input type="password" name="password" id="password" class="form-control" required>
                    </div>

                    @error('password')
                        <div class="alert alert-danger mt-3">
                            {{ $message }}
                        </div>
                    @enderror

                    <div class="form-group" style="margin-top: 20px;">
                        <button type="submit" class="btn btn-danger">退会する</button>
                    </div>
                </form>
            @endif
        </div>
    </section>
@endsection


