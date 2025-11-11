@extends('layout')

@section('title', 'パスワード変更')
@section('current-node-title', 'パスワード変更')

@section('nodes')
    <section class="node" id="password-change-form-node">
        <div class="node-head">
            <h2 class="node-head-text">パスワード変更</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            @if (session('success'))
                <div class="alert alert-success mt-3">
                    {{ session('success') }}
                </div>
            @endif

            <form action="{{ route('User.MyNode.Password.Update') }}" method="POST">
                @csrf
                <div class="form-group mb-3">
                    <label for="current_password" class="form-label">現在のパスワード</label>
                    <input type="password" name="current_password" id="current_password" class="form-control" required>
                    @error('current_password')
                        <div class="alert alert-danger mt-3">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <div class="form-group mb-3">
                    <label for="password" class="form-label">新しいパスワード</label>
                    <input type="password" name="password" id="password" class="form-control" required>
                    @error('password')
                        <div class="alert alert-danger mt-3">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <div class="form-group mb-3">
                    <label for="password_confirmation" class="form-label">新しいパスワード（確認）</label>
                    <input type="password" name="password_confirmation" id="password_confirmation" class="form-control" required>
                </div>

                <div class="form-group" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-success">変更する</button>
                </div>
            </form>
        </div>
    </section>
    @include('common.shortcut')
@endsection


