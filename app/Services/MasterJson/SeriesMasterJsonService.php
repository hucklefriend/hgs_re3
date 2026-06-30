<?php

namespace App\Services\MasterJson;

use App\Models\GameSeries;
use Illuminate\Support\Facades\DB;

/**
 * シリーズ本体のJSONエクスポート・差分計算・反映を行う
 *
 * シリーズはフランチャイズ・タイトルと紐づくが、
 * この機能ではシリーズ本体のフィールドのみを対象とし、
 * それらとの関連付け管理は対象外とする。
 */
class SeriesMasterJsonService
{
    private const SERIES_FIELDS = [
        ['key' => 'name', 'label' => '名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'phonetic', 'label' => 'よみがな', 'type' => 'string', 'required' => true, 'maxlength' => 200, 'regex' => '/^[あ-ん][ぁ-んー0-9]*$/u'],
        ['key' => 'node_name', 'label' => 'ノード表示用の名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'description', 'label' => '説明文', 'type' => 'text'],
        ['key' => 'description_source', 'label' => '説明文の引用元', 'type' => 'text'],
    ];

    /**
     * AIに渡すJSONを生成
     */
    public function export(GameSeries $series): array
    {
        return [
            '_meta' => [
                'schema'         => 'game_series',
                'schema_version' => 1,
                'exported_at'    => now()->toIso8601String(),
                'lock'           => [
                    'game_series' => $series->updated_at?->toIso8601String(),
                ],
            ],
            'game_series' => $this->exportRow($series),
        ];
    }

    /**
     * 1レコード分をJSON出力用配列に変換する
     */
    private function exportRow(GameSeries $series): array
    {
        $data = ['id' => $series->id];

        foreach (self::SERIES_FIELDS as $spec) {
            $value = MasterJsonFieldHelper::normalizeCurrentValue($spec, $series->{$spec['key']});
            $data[$spec['key']] = MasterJsonFieldHelper::exportValue($spec, $value);
        }

        return $data;
    }

    /**
     * 現在のDB値と取り込みJSONを比較し差分を作る
     */
    public function diff(GameSeries $series, string $rawJson): array
    {
        $result = [
            'errors'      => [],
            'warnings'    => [],
            'has_changes' => false,
            'series'      => null,
        ];

        $incoming = json_decode($rawJson, true);
        if (!is_array($incoming)) {
            $result['errors'][] = 'JSONの解析に失敗しました。形式を確認してください。';
            return $result;
        }
        if (($incoming['_meta']['schema'] ?? null) !== 'game_series') {
            $result['errors'][] = 'スキーマ種別が一致しません（game_series が必要です）。';
            return $result;
        }
        $incomingSeries = $incoming['game_series'] ?? null;
        if (!is_array($incomingSeries) || (int) ($incomingSeries['id'] ?? 0) !== $series->id) {
            $result['errors'][] = 'シリーズIDが一致しません。エクスポートしたJSONを編集してください。';
            return $result;
        }

        $lock = $incoming['_meta']['lock'] ?? [];
        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_series'] ?? null, $series->updated_at);
        if ($lockConflict) {
            $result['warnings'][] = 'シリーズ本体: エクスポート後に他で更新されています。内容を確認してください。';
        }

        $fields = [];
        foreach (self::SERIES_FIELDS as $spec) {
            $f = MasterJsonFieldHelper::diffField($spec, $series->{$spec['key']}, $incomingSeries, $result['warnings'], 'シリーズ本体');
            if ($f !== null) {
                $fields[] = $f;
            }
        }
        $result['series'] = ['id' => $series->id, 'lock_conflict' => $lockConflict, 'fields' => $fields];
        if (!empty($fields)) {
            $result['has_changes'] = true;
        }

        return $result;
    }

    /**
     * 採用された差分のみをDBへ反映する
     *
     * @param array $accept ['series_fields'=>[]]
     * @return array 実際に適用された差分（監査ログ用）
     * @throws \Throwable
     */
    public function apply(GameSeries $series, string $rawJson, array $accept): array
    {
        $diff = $this->diff($series, $rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $applied = ['series' => []];
        $acceptedFields = $accept['series_fields'] ?? [];

        DB::transaction(function () use ($series, $diff, $acceptedFields, &$applied) {
            foreach ($diff['series']['fields'] as $f) {
                if (in_array($f['key'], $acceptedFields, true)) {
                    $series->{$f['key']} = $f['raw_after'];
                    $applied['series'][] = $f;
                }
            }
            if ($series->isDirty()) {
                $series->save();
            }
        });

        return $applied;
    }
}
