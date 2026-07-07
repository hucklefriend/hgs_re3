<?php

namespace App\Services\MasterJson;

use App\Enums\Rating;
use App\Models\GameFranchise;
use Illuminate\Support\Facades\DB;

/**
 * フランチャイズ本体のJSONエクスポート・差分計算・反映を行う
 *
 * フランチャイズはシリーズ・タイトル・メディアミックスと紐づくが、
 * この機能ではフランチャイズ本体のフィールドのみを対象とし、
 * それらとの関連付け管理は対象外とする。
 */
class FranchiseMasterJsonService
{
    private const FRANCHISE_FIELDS = [
        ['key' => 'name', 'label' => '名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'phonetic', 'label' => 'よみがな', 'type' => 'string', 'required' => true, 'maxlength' => 200, 'regex' => '/^[あ-ん][ぁ-んー0-9]*$/u'],
        ['key' => 'node_name', 'label' => 'ノード表示用の名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'description', 'label' => '説明文', 'type' => 'text'],
        ['key' => 'description_source', 'label' => '説明文の引用元', 'type' => 'text'],
        ['key' => 'rating', 'label' => 'レーティング', 'type' => 'enum', 'enum' => Rating::class, 'required' => true],
    ];

    /**
     * AIに渡すJSONを生成
     */
    public function export(GameFranchise $franchise): array
    {
        return [
            '_meta' => [
                'schema'         => 'game_franchise',
                'schema_version' => 1,
                'exported_at'    => now()->toIso8601String(),
                'lock'           => [
                    'game_franchise' => $franchise->updated_at?->toIso8601String(),
                ],
            ],
            'game_franchise' => $this->exportRow($franchise),
        ];
    }

    /**
     * 1レコード分をJSON出力用配列に変換する
     */
    private function exportRow(GameFranchise $franchise): array
    {
        $data = ['id' => $franchise->id];
        $ref = [];

        foreach (self::FRANCHISE_FIELDS as $spec) {
            $value = MasterJsonFieldHelper::normalizeCurrentValue($spec, $franchise->{$spec['key']});
            $data[$spec['key']] = MasterJsonFieldHelper::exportValue($spec, $value);

            if ($spec['type'] === 'enum' && $value instanceof \UnitEnum) {
                $text = MasterJsonFieldHelper::enumDisplayText($value);
                if ($text !== null) {
                    $ref["{$spec['key']}_text"] = $text;
                }
            }
        }

        if (!empty($ref)) {
            $data['_ref'] = $ref;
        }

        return $data;
    }

    /**
     * 現在のDB値と取り込みJSONを比較し差分を作る
     */
    public function diff(GameFranchise $franchise, string $rawJson): array
    {
        $result = [
            'errors'      => [],
            'warnings'    => [],
            'has_changes' => false,
            'franchise'   => null,
        ];

        $incoming = json_decode($rawJson, true);
        if (!is_array($incoming)) {
            $result['errors'][] = 'JSONの解析に失敗しました。形式を確認してください。';
            return $result;
        }
        if (($incoming['_meta']['schema'] ?? null) !== 'game_franchise') {
            $result['errors'][] = 'スキーマ種別が一致しません（game_franchise が必要です）。';
            return $result;
        }
        $incomingFranchise = $incoming['game_franchise'] ?? null;
        if (!is_array($incomingFranchise) || (int) ($incomingFranchise['id'] ?? 0) !== $franchise->id) {
            $result['errors'][] = 'フランチャイズIDが一致しません。エクスポートしたJSONを編集してください。';
            return $result;
        }

        $lock = $incoming['_meta']['lock'] ?? [];
        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_franchise'] ?? null, $franchise->updated_at);
        if ($lockConflict) {
            $result['warnings'][] = 'フランチャイズ本体: エクスポート後に他で更新されています。内容を確認してください。';
        }

        $fields = [];
        foreach (self::FRANCHISE_FIELDS as $spec) {
            $f = MasterJsonFieldHelper::diffField($spec, $franchise->{$spec['key']}, $incomingFranchise, $result['warnings'], 'フランチャイズ本体');
            if ($f !== null) {
                $fields[] = $f;
            }
        }
        $result['franchise'] = ['id' => $franchise->id, 'lock_conflict' => $lockConflict, 'fields' => $fields];
        if (!empty($fields)) {
            $result['has_changes'] = true;
        }

        return $result;
    }

    /**
     * 採用された差分のみをDBへ反映する
     *
     * @param array $accept ['franchise_fields'=>[]]
     * @return array 実際に適用された差分（監査ログ用）
     * @throws \Throwable
     */
    public function apply(GameFranchise $franchise, string $rawJson, array $accept): array
    {
        $diff = $this->diff($franchise, $rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $applied = ['franchise' => []];
        $acceptedFields = $accept['franchise_fields'] ?? [];

        DB::transaction(function () use ($franchise, $diff, $acceptedFields, &$applied) {
            foreach ($diff['franchise']['fields'] as $f) {
                if (in_array($f['key'], $acceptedFields, true)) {
                    $franchise->{$f['key']} = $f['raw_after'];
                    $applied['franchise'][] = $f;
                }
            }
            if ($franchise->isDirty()) {
                $franchise->save();
            }
        });

        return $applied;
    }
}
