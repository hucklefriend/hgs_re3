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
                <a href="{{ route('Admin.Game.MediaMix.JsonImport', $model) }}" class="btn btn-default">JSON入力へ戻る</a>
            @else
                <form method="POST" action="{{ route('Admin.Game.MediaMix.JsonApply', $model) }}">
                    @csrf
                    <input type="hidden" name="imported_json" value="{{ $importedJson }}">

                    @if (!empty($diff['media_mix']['fields']))
                        <h5 class="mt-2">
                            メディアミックス本体
                            @if ($diff['media_mix']['lock_conflict'])
                                <span class="badge bg-warning">他で更新あり</span>
                            @endif
                        </h5>
                        @include('admin.game.master_json._fields_table', ['fields' => $diff['media_mix']['fields'], 'checkboxName' => 'accept[media_mix_fields]'])
                    @endif

                    @foreach ($diff['related_products'] as $product)
                        <div class="border rounded p-3 mb-3">
                            @if ($product['op'] !== null)
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" name="accept[related_products][{{ $product['id'] }}]" value="1" id="product{{ $product['id'] }}" checked>
                                    <label class="form-check-label fw-bold" for="product{{ $product['id'] }}">
                                        関連商品「{{ $product['label'] }}」
                                        @if ($product['op'] === 'unlink')
                                            <span class="badge bg-danger">メディアミックスから関連解除</span>
                                        @endif
                                        @if ($product['lock_conflict'])
                                            <span class="badge bg-warning">他で更新あり</span>
                                        @endif
                                    </label>
                                </div>
                            @else
                                <h6 class="fw-bold">関連商品「{{ $product['label'] }}」</h6>
                            @endif
                            @include('admin.game.master_json._fields_readonly', ['fields' => $product['fields']])

                            @foreach ($product['shops'] as $shop)
                                <div class="form-check mb-1 ms-4">
                                    <input class="form-check-input" type="checkbox" name="accept[product_shops][{{ $shop['id'] }}]" value="1" id="shop{{ $shop['id'] }}" checked>
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

                            @foreach ($product['new_shops'] as $newShop)
                                <div class="form-check mb-1 ms-4">
                                    <input class="form-check-input" type="checkbox" name="accept[new_product_shops][{{ $product['id'] }}:{{ $newShop['tmp_key'] }}]" value="1" id="newshop{{ $product['id'] }}_{{ $newShop['tmp_key'] }}" checked>
                                    <label class="form-check-label" for="newshop{{ $product['id'] }}_{{ $newShop['tmp_key'] }}">
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
            <a href="{{ route('Admin.Game.MediaMix.Detail', $model) }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 詳細へ戻る</a>
        </div>
    </div>
@endsection
