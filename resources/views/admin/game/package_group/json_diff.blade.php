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
                <a href="{{ route('Admin.Game.PackageGroup.JsonImport', $model) }}" class="btn btn-default">JSON入力へ戻る</a>
            @else
                <form method="POST" action="{{ route('Admin.Game.PackageGroup.JsonApply', $model) }}">
                    @csrf
                    <input type="hidden" name="imported_json" value="{{ $importedJson }}">

                    @if (!empty($diff['package_group']['fields']))
                        <h5 class="mt-2">
                            パッケージグループ本体
                            @if ($diff['package_group']['lock_conflict'])
                                <span class="badge bg-warning">他で更新あり</span>
                            @endif
                        </h5>
                        @include('admin.game.master_json._fields_table', ['fields' => $diff['package_group']['fields'], 'checkboxName' => 'accept[package_group_fields]'])
                    @endif

                    @foreach ($diff['packages'] as $package)
                        @php($packageKey = $package['id'] ?? $package['tmp_key'])
                        <div class="border rounded p-3 mb-3">
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" name="accept[packages][{{ $packageKey }}]" value="1" id="package{{ $packageKey }}" checked>
                                <label class="form-check-label fw-bold" for="package{{ $packageKey }}">
                                    パッケージ「{{ $package['label'] }}」
                                    @if ($package['op'] === 'unlink')
                                        <span class="badge bg-danger">グループから関連解除</span>
                                    @elseif ($package['op'] === 'create')
                                        <span class="badge bg-success">新規追加</span>
                                    @endif
                                    @if ($package['lock_conflict'])
                                        <span class="badge bg-warning">他で更新あり</span>
                                    @endif
                                </label>
                            </div>
                            @include('admin.game.master_json._fields_readonly', ['fields' => $package['fields']])

                            @foreach ($package['shops'] as $shop)
                                <div class="form-check mb-1 ms-4">
                                    <input class="form-check-input" type="checkbox" name="accept[package_shops][{{ $shop['id'] }}]" value="1" id="shop{{ $shop['id'] }}" checked>
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

                            @foreach ($package['new_shops'] as $newShop)
                                <div class="form-check mb-1 ms-4">
                                    <input class="form-check-input" type="checkbox" name="accept[new_package_shops][{{ $packageKey }}:{{ $newShop['tmp_key'] }}]" value="1" id="newshop{{ $packageKey }}_{{ $newShop['tmp_key'] }}" checked>
                                    <label class="form-check-label" for="newshop{{ $packageKey }}_{{ $newShop['tmp_key'] }}">
                                        {{ $newShop['label'] }}
                                        <span class="badge bg-success">新規追加</span>
                                    </label>
                                </div>
                                @include('admin.game.master_json._fields_readonly', ['fields' => $newShop['fields']])
                            @endforeach
                        </div>
                    @endforeach

                    <button type="submit" class="btn btn-primary">選択した変更を保存</button>
                </form>
            @endif
        </div>
        <div class="panel-footer">
            <a href="{{ route('Admin.Game.PackageGroup.Detail', $model) }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 詳細へ戻る</a>
        </div>
    </div>
@endsection
