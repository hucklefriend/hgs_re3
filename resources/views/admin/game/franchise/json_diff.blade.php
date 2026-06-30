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
                <a href="{{ route('Admin.Game.Franchise.JsonImport', $model) }}" class="btn btn-default">JSON入力へ戻る</a>
            @else
                <form method="POST" action="{{ route('Admin.Game.Franchise.JsonApply', $model) }}">
                    @csrf
                    <input type="hidden" name="imported_json" value="{{ $importedJson }}">

                    <h5 class="mt-2">
                        フランチャイズ本体
                        @if ($diff['franchise']['lock_conflict'])
                            <span class="badge bg-warning">他で更新あり</span>
                        @endif
                    </h5>
                    @include('admin.game.master_json._fields_table', ['fields' => $diff['franchise']['fields'], 'checkboxName' => 'accept[franchise_fields]'])

                    <button type="submit" class="btn btn-primary">選択した変更を保存</button>
                </form>
            @endif
        </div>
        <div class="panel-footer">
            <a href="{{ route('Admin.Game.Franchise.Detail', $model) }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 詳細へ戻る</a>
        </div>
    </div>
@endsection
