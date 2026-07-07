@extends('admin.layout')

@section('content')
    @include('admin.all_errors')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">パッケージ - JSONから新規作成</h4>
        </div>
        <div class="panel-body">
            <p class="text-muted">
                下記のひな形JSONをAI（ChatGPT・Claude・Geminiなど）に渡し、新規作成したい
                パッケージ・ショップの内容を埋めてもらってください。
                生成されたJSONを下のフォームに貼り付けて「差分を確認」を押してください。
            </p>
            <div class="mb-2">
                <button type="button" class="btn btn-default" id="btn-copy-json"><i class="fas fa-copy"></i> クリップボードへコピー</button>
                <span id="copy-status" class="text-success ms-2" style="display:none;">コピーしました</span>
            </div>
            <textarea id="export-json" class="form-control mb-3" rows="20" style="height:350px;" readonly>{{ $json }}</textarea>

            <form method="POST" action="{{ route('Admin.Game.Package.JsonNewDiff') }}">
                @csrf
                <textarea name="imported_json" class="form-control" rows="20" style="height:350px;" placeholder="AIが生成したJSONをここに貼り付け">{{ old('imported_json') }}</textarea>
                <div class="mt-2">
                    <button type="submit" class="btn btn-primary">差分を確認</button>
                </div>
            </form>
        </div>
        <div class="panel-footer">
            <a href="{{ route('Admin.Game.Package') }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 一覧へ戻る</a>
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
