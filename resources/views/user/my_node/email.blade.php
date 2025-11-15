@extends('layout')

@section('title', 'メールアドレス変更')
@section('current-node-title', 'メールアドレス変更')

@section('nodes')
    <section class="node" id="email-change-form-node">
        <div class="node-head">
            <h2 class="node-head-text">メールアドレス変更</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>現在のメールアドレス：{{ $user->email }}</p>
            <p>新しいメールアドレスを入力後、送信された確認メールのリンクから変更を確定してください。</p>

            <form action="{{ route('User.MyNode.Email.Update') }}" method="POST">
                @csrf
                <div class="form-group mb-3">
                    <label for="new_email" class="form-label">新しいメールアドレス</label>
                    <input type="email" name="new_email" id="new_email" class="form-control" value="{{ old('new_email') }}" required>
                    @error('new_email')
                        <div class="alert alert-danger mt-3">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <div class="form-group" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-success">確認メールを送信</button>
                </div>
            </form>
        </div>
    </section>
    @include('common.shortcut')
@endsection


