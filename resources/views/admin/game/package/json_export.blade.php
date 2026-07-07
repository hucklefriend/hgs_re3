@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }} - JSON出力</h4>
        </div>
        <div class="panel-body">
            <p class="text-muted">
                下記のJSONをAI（ChatGPT・Claude・Geminiなど）に渡し、最新情報を反映したJSONを生成してもらってください。
                生成されたJSONは「JSON入力」画面に貼り付けてください。
            </p>
            <div class="mb-2">
                <button type="button" class="btn btn-default" id="btn-copy-json"><i class="fas fa-copy"></i> クリップボードへコピー</button>
                <span id="copy-status" class="text-success ms-2" style="display:none;">コピーしました</span>
            </div>
            <textarea id="export-json" class="form-control" rows="30" style="height:500px;" readonly>{{ $json }}</textarea>
        </div>
        <div class="panel-footer">
            <a href="{{ route('Admin.Game.Package.Detail', $model) }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 詳細へ戻る</a>
            <a href="{{ route('Admin.Game.Package.JsonImport', $model) }}" class="btn btn-primary">JSON入力へ</a>
        </div>
    </div>
@endsection

@section('js')
<script>
$(function () {
    $('#btn-copy-json').on('click', function () {
        var text = $('#export-json').val();
        navigator.clipboard.writeText(text).then(function () {
            $('#copy-status').stop(true, true).show().delay(1500).fadeOut();
        });
    });
});
</script>
@endsection
