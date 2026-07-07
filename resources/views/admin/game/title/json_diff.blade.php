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
                <a href="{{ route('Admin.Game.Title.JsonImport', $model) }}" class="btn btn-default">JSON入力へ戻る</a>
            @else
                <form method="POST" action="{{ route('Admin.Game.Title.JsonApply', $model) }}">
                    @csrf
                    <input type="hidden" name="imported_json" value="{{ $importedJson }}">

                    @if (!empty($diff['title']['fields']))
                        <h5 class="mt-2">
                            タイトル本体
                            @if ($diff['title']['lock_conflict'])
                                <span class="badge bg-warning">他で更新あり</span>
                            @endif
                        </h5>
                        @include('admin.game.master_json._fields_table', ['fields' => $diff['title']['fields'], 'checkboxName' => 'accept[title_fields]'])
                    @endif

                    @foreach ($diff['package_groups'] as $group)
                        <div class="border rounded p-3 mb-3">
                            @if ($group['op'] !== null)
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" name="accept[package_groups][{{ $group['id'] }}]" value="1" id="group{{ $group['id'] }}" checked>
                                    <label class="form-check-label fw-bold" for="group{{ $group['id'] }}">
                                        パッケージグループ「{{ $group['label'] }}」
                                        @if ($group['op'] === 'unlink')
                                            <span class="badge bg-danger">タイトルから関連解除</span>
                                        @endif
                                        @if ($group['lock_conflict'])
                                            <span class="badge bg-warning">他で更新あり</span>
                                        @endif
                                    </label>
                                </div>
                            @else
                                <h5 class="fw-bold">パッケージグループ「{{ $group['label'] }}」</h5>
                            @endif
                            @include('admin.game.master_json._fields_readonly', ['fields' => $group['fields']])

                            @foreach ($group['packages'] as $package)
                                <div class="border rounded p-3 mb-2 ms-4">
                                    @if ($package['op'] !== null)
                                        <div class="form-check mb-2">
                                            <input class="form-check-input" type="checkbox" name="accept[packages][{{ $package['id'] }}]" value="1" id="package{{ $package['id'] }}" checked>
                                            <label class="form-check-label fw-bold" for="package{{ $package['id'] }}">
                                                パッケージ「{{ $package['label'] }}」
                                                @if ($package['op'] === 'unlink')
                                                    <span class="badge bg-danger">グループから関連解除</span>
                                                @endif
                                                @if ($package['lock_conflict'])
                                                    <span class="badge bg-warning">他で更新あり</span>
                                                @endif
                                            </label>
                                        </div>
                                    @else
                                        <h6 class="fw-bold">パッケージ「{{ $package['label'] }}」</h6>
                                    @endif
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
                                            <input class="form-check-input" type="checkbox" name="accept[new_package_shops][{{ $package['id'] }}:{{ $newShop['tmp_key'] }}]" value="1" id="newshop{{ $package['id'] }}_{{ $newShop['tmp_key'] }}" checked>
                                            <label class="form-check-label" for="newshop{{ $package['id'] }}_{{ $newShop['tmp_key'] }}">
                                                {{ $newShop['label'] }}
                                                <span class="badge bg-success">新規追加</span>
                                            </label>
                                        </div>
                                        @include('admin.game.master_json._fields_readonly', ['fields' => $newShop['fields']])
                                    @endforeach
                                </div>
                            @endforeach
                        </div>
                    @endforeach

                    <button type="submit" class="btn btn-primary">選択した変更を保存</button>
                </form>
            @endif
        </div>
        <div class="panel-footer">
            <a href="{{ route('Admin.Game.Title.Detail', $model) }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 詳細へ戻る</a>
        </div>
    </div>
@endsection
