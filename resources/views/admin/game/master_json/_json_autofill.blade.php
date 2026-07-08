{{--
    新規登録フォーム用のJSON自動入力ウィジェット。
    export_json（MCP等でAIが作成したもの）を貼り付けると、対応するフォーム項目（id/name一致）に自動入力する。
    反映されるのはJSONに含まれるキーのみ。フランチャイズ/シリーズ等の紐づけはJSONに含まれないため手動設定が必要。

    使い方: @include('admin.game.master_json._json_autofill', ['schema' => 'game_series'])
--}}
@php
    $autofillId = 'json-autofill-' . str_replace('_', '-', $schema);
    $ratingValueMap = collect(\App\Enums\Rating::cases())->mapWithKeys(fn ($c) => [$c->name => $c->value])->toArray();
    $enumValueMaps = ['rating' => $ratingValueMap];
@endphp
<div class="border rounded p-3 mb-3">
    <h5 class="mb-2">JSONから入力</h5>
    <p class="text-muted small mb-2">
        export_json で取得したJSON（MCP経由でAIが作成したものなど）を貼り付けて「フォームに反映」を押すと、対応する項目に自動入力します。
        フランチャイズ・シリーズ等の紐づけは対象外のため、反映後に内容を確認してから保存してください。
    </p>
    <textarea id="{{ $autofillId }}-textarea" class="form-control mb-2" rows="6" placeholder='{"_meta": {"schema": "{{ $schema }}"}, "{{ $schema }}": {...}}'></textarea>
    <button type="button" id="{{ $autofillId }}-button" class="btn btn-sm btn-outline-secondary">フォームに反映</button>
    <div id="{{ $autofillId }}-message" class="small mt-2"></div>
</div>

@section('js')
<script>
(function () {
    var expectedSchema = @json($schema);
    var enumValueMaps = @json($enumValueMaps);
    var button = document.getElementById(@json($autofillId . '-button'));
    var textarea = document.getElementById(@json($autofillId . '-textarea'));
    var message = document.getElementById(@json($autofillId . '-message'));

    if (!button || !textarea || !message) {
        return;
    }

    function showError(text) {
        message.textContent = text;
        message.className = 'small mt-2 text-danger';
    }

    button.addEventListener('click', function () {
        var json;
        try {
            json = JSON.parse(textarea.value);
        } catch (e) {
            showError('JSONの解析に失敗しました。形式を確認してください。');
            return;
        }

        var schema = json && json._meta && json._meta.schema;
        if (schema !== expectedSchema) {
            showError('スキーマ種別が一致しません（' + expectedSchema + ' が必要です）。');
            return;
        }

        var data = json[schema];
        if (typeof data !== 'object' || data === null) {
            showError(schema + ' が見つかりません。');
            return;
        }

        var filled = [];
        var skipped = [];
        Object.keys(data).forEach(function (key) {
            if (key === 'id' || key === '_ref') {
                return;
            }
            var el = document.getElementById(key) || document.querySelector('[name="' + key + '"]');
            if (!el) {
                skipped.push(key);
                return;
            }
            var value = data[key];
            if (enumValueMaps[key] && Object.prototype.hasOwnProperty.call(enumValueMaps[key], value)) {
                value = enumValueMaps[key][value];
            }
            el.value = value === null || value === undefined ? '' : value;
            if (typeof window.jQuery === 'function' && el.tagName === 'SELECT') {
                window.jQuery(el).trigger('change');
            }
            filled.push(key);
        });

        message.textContent = filled.length + '件のフィールドに反映しました' + (skipped.length ? '（未対応の項目: ' + skipped.join(', ') + '）' : '') + '。内容を確認して保存してください。';
        message.className = 'small mt-2 text-success';
    });
})();
</script>
@endsection
