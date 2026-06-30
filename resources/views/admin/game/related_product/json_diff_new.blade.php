@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">関連商品 - JSONから新規作成（確認）</h4>
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

            <form method="POST" action="{{ route('Admin.Game.RelatedProduct.JsonNewApply') }}">
                @csrf
                <input type="hidden" name="imported_json" value="{{ $importedJson }}">

                <h5 class="mt-2">関連商品本体 <span class="badge bg-success">新規作成</span></h5>
                @include('admin.game.master_json._fields_table', ['fields' => $diff['related_product']['fields'], 'checkboxName' => 'accept[related_product_fields]'])

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

                <button type="submit" class="btn btn-primary">この内容で新規作成</button>
            </form>
        </div>
        <div class="panel-footer">
            <a href="{{ route('Admin.Game.RelatedProduct.JsonNew') }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 戻る</a>
        </div>
    </div>
@endsection
