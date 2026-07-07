@extends('admin.layout')

@section('content')
    @include('admin.all_errors')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }} - JSON入力</h4>
        </div>
        <div class="panel-body">
            <p class="text-muted">AIが書き換えたJSONを貼り付けて、「差分を確認」を押してください。</p>
            <form method="POST" action="{{ route('Admin.Game.Series.JsonDiff', $model) }}">
                @csrf
                <textarea name="imported_json" class="form-control" rows="30" style="height:500px;" placeholder="ここにJSONを貼り付け">{{ old('imported_json') }}</textarea>
                <div class="mt-2">
                    <button type="submit" class="btn btn-primary">差分を確認</button>
                </div>
            </form>
        </div>
        <div class="panel-footer">
            <a href="{{ route('Admin.Game.Series.Detail', $model) }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 詳細へ戻る</a>
            <a href="{{ route('Admin.Game.Series.JsonExport', $model) }}" class="btn btn-default">JSON出力へ</a>
        </div>
    </div>
@endsection
