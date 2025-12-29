@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">パスワード変更 #{{ $model->id }}</h4>
        </div>
        <div class="panel-body">
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i> 管理者によるパスワード再設定です。現在のパスワードは表示・入力されません。
            </div>

            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('Admin.Manage.User.Password.Update', $model) }}" method="POST">
                @csrf

                <div class="mb-3">
                    <label for="password" class="form-label">新しいパスワード <span class="text-danger">*</span></label>
                    <div class="input-group">
                        <input type="text" name="password" id="password" class="form-control" value="{{ old('password') }}" required minlength="8">
                        <button type="button" class="btn btn-secondary" id="generate-password">
                            <i class="fas fa-random"></i> 自動生成
                        </button>
                    </div>
                    <small class="text-muted">※ 入力内容はそのまま保存され、2回入力は不要です。</small>
                </div>

                <div class="d-flex justify-content-between">
                    <a href="{{ route('Admin.Manage.User.Show', $model) }}" class="btn btn-default">
                        <i class="fas fa-arrow-left"></i> 戻る
                    </a>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> 更新する
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection

@section('js')
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const generateButton = document.getElementById('generate-password');
        const passwordInput = document.getElementById('password');
        const prefixes = [
            'Biohazard', 'Zero', 'SilentHill', 'Siren', 'Outlast', 'DeadSpace',
            'Bioshock', 'TheLastOfUs', 'Echonight', 'ClockTower', 'FNaF', 'PoppyPlaytime'
        ];
        const symbols = '!@#$%^&*()-_=+[]{};:,./?';

        generateButton?.addEventListener('click', () => {
            const symbolCount = Math.random() < 0.5 ? 1 : 2;
            let symbolPart = '';
            for (let i = 0; i < symbolCount; i++) {
                symbolPart += symbols.charAt(Math.floor(Math.random() * symbols.length));
            }

            const digitCount = 3 + Math.floor(Math.random() * 3); // 3 to 5
            let digitPart = '';
            for (let i = 0; i < digitCount; i++) {
                digitPart += Math.floor(Math.random() * 10);
            }

            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const password = `${prefix}${symbolPart}${digitPart}`;
            passwordInput.value = password;
            passwordInput.focus();
            passwordInput.select();
        });
    });
</script>
@endsection


