@extends('layout')

@section('title', 'プロフィール設定')
@section('current-node-title', 'プロフィール設定')

@section('nodes')
    <section class="node" id="avatar-edit-node">
        <div class="node-head">
            <h2 class="node-head-text">アバター</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <div class="flex items-center gap-4 mb-4">
                <img id="avatar-preview"
                     src="{{ $user->getAvatarUrl() }}"
                     alt="アバター"
                     class="w-20 h-20 rounded-full object-cover">
                <div class="flex flex-col gap-2">
                    <label class="btn btn-sm btn-outline cursor-pointer">
                        画像を選択
                        <input type="file" id="avatar-file-input" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden">
                    </label>
                    <button type="button" id="avatar-delete-btn" class="btn btn-sm btn-outline-danger {{ $user->avatar_filename ? '' : 'hidden' }}">
                        削除（デフォルトに戻す）
                    </button>
                </div>
            </div>
            <div id="avatar-save-area" class="hidden flex items-center gap-3">
                <button type="button" id="avatar-save-btn" class="btn btn-sm btn-success">保存する</button>
                <button type="button" id="avatar-cancel-btn" class="btn btn-sm btn-outline">キャンセル</button>
            </div>
            <p id="avatar-message" class="text-sm mt-2 hidden"></p>
            <p class="text-slate-500 text-xs mt-2">JPEG / PNG / GIF / WebP、2MB まで。200×200px に自動でリサイズされます。</p>
            <input type="hidden" id="avatar-update-url" value="{{ route('User.MyNode.Avatar.Update') }}">
            <input type="hidden" id="avatar-delete-url" value="{{ route('User.MyNode.Avatar.Delete') }}">
        </div>
    </section>

    <section class="node" id="profile-edit-node">
        <div class="node-head">
            <h2 class="node-head-text">プロフィール設定</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <form action="{{ route('User.MyNode.Profile.Update') }}" method="POST">
                @csrf
                <div class="form-group mb-3">
                    <label for="name" class="form-label">表示名</label>
                    <input type="text" name="name" id="name" class="form-control" value="{{ old('name', $user->name) }}" required maxlength="255">
                    @error('name')
                        <div class="alert alert-warning mt-3">
                            {{ $message }}
                        </div>
                    @enderror
                </div>
                <div class="form-group mb-3">
                    <label for="show_id" class="form-label">ユーザーID</label>
                    <input type="text" name="show_id" id="show_id" class="form-control" value="{{ old('show_id', $user->show_id) }}" required maxlength="30">
                    <small class="form-text text-muted">使用可能文字：英数字、ハイフン、アンダースコア（1〜30文字）</small>
                    @error('show_id')
                        <div class="alert alert-warning mt-3">
                            {{ $message }}
                        </div>
                    @enderror
                </div>
                <div class="form-group mb-3">
                    <label for="bio" class="form-label">自己紹介</label>
                    <textarea name="bio" id="bio" class="form-control" rows="3" maxlength="200">{{ old('bio', $user->bio) }}</textarea>
                    <small class="form-text text-muted">200文字まで</small>
                    @error('bio')
                        <div class="alert alert-warning mt-3">
                            {{ $message }}
                        </div>
                    @enderror
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-success">更新</button>
                </div>
            </form>
        </div>
    </section>

@endsection


