@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }} - JSON差分確認</h4>
        </div>
        <div class="panel-body">
            @if (!empty($diff['warnings']))
                <div class="alert alert-warning">
                    <ul class="mb-0">
                        @foreach ($diff['warnings'] as $warning)
                            <li>{{ $warning }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @if (!$diff['has_changes'])
                <p class="text-muted">変更点は見つかりませんでした。</p>
                <a href="{{ route('Admin.Game.Package.JsonImport', $model) }}" class="btn btn-default">JSON入力へ戻る</a>
            @else
                <form method="POST" action="{{ route('Admin.Game.Package.JsonApply', $model) }}">
                    @csrf
                    <input type="hidden" name="imported_json" value="{{ $importedJson }}">

                    @if (!empty($diff['package']['fields']))
                        <h5 class="mt-2">
                            パッケージ本体
                            @if ($diff['package']['lock_conflict'])
                                <span class="badge bg-warning">他で更新あり</span>
                            @endif
                        </h5>
                        @include('admin.game.master_json._fields_table', ['fields' => $diff['package']['fields'], 'checkboxName' => 'accept[package_fields]'])
                    @endif

                    @foreach ($diff['shops'] as $shop)
                        <div class="form-check mb-1">
                            <input class="form-check-input" type="checkbox" name="accept[shops][{{ $shop['id'] }}]" value="1" id="shop{{ $shop['id'] }}" checked>
                            <label class="form-check-label" for="shop{{ $shop['id'] }}">
                                {{ $shop['label'] }}
                                @if ($shop['op'] === 'delete')
                                    <span class="badge bg-danger">削除</span>
                                @endif
                                @if ($shop['lock_conflict'])
                                    <span class="badge bg-warning">他で更新あり</span>
                                @endif
                            </label>
                        </div>
                        @include('admin.game.master_json._fields_readonly', ['fields' => $shop['fields']])
                    @endforeach

                    @foreach ($diff['new_shops'] as $newShop)
                        <div class="form-check mb-1">
                            <input class="form-check-input" type="checkbox" name="accept[new_shops][{{ $newShop['tmp_key'] }}]" value="1" id="newshop{{ $newShop['tmp_key'] }}" checked>
                            <label class="form-check-label" for="newshop{{ $newShop['tmp_key'] }}">
                                {{ $newShop['label'] }}
                                <span class="badge bg-success">新規追加</span>
                            </label>
                        </div>
                        @include('admin.game.master_json._fields_readonly', ['fields' => $newShop['fields']])
                    @endforeach

                    <button type="submit" class="btn btn-primary">選択した変更を保存</button>
                </form>
            @endif
        </div>
        <div class="panel-footer">
            <a href="{{ route('Admin.Game.Package.Detail', $model) }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 詳細へ戻る</a>
        </div>
    </div>
@endsection
