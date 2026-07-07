<?php

namespace App\Services\MasterJson;

use App\Models\GameMediaMixGroup;
use Illuminate\Support\Facades\DB;

class MediaMixGroupMasterJsonService
{
    private const FIELDS = [
        ['key' => 'name', 'label' => '名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'node_name', 'label' => 'ノード表示用の名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'description', 'label' => '説明文', 'type' => 'text'],
    ];

    public function export(GameMediaMixGroup $group): array
    {
        $data = ['id' => $group->id];
        foreach (self::FIELDS as $spec) {
            $value = MasterJsonFieldHelper::normalizeCurrentValue($spec, $group->{$spec['key']});
            $data[$spec['key']] = MasterJsonFieldHelper::exportValue($spec, $value);
        }

        return [
            '_meta' => [
                'schema'         => 'game_media_mix_group',
                'schema_version' => 1,
                'exported_at'    => now()->toIso8601String(),
                'lock'           => [
                    'game_media_mix_group' => $group->updated_at?->toIso8601String(),
                ],
            ],
            'game_media_mix_group' => $data,
        ];
    }

    public function diff(GameMediaMixGroup $group, string $rawJson): array
    {
        $result = [
            'errors'      => [],
            'warnings'    => [],
            'has_changes' => false,
            'group'       => null,
        ];

        $incoming = json_decode($rawJson, true);
        if (!is_array($incoming)) {
            $result['errors'][] = 'JSONの解析に失敗しました。形式を確認してください。';
            return $result;
        }
        if (($incoming['_meta']['schema'] ?? null) !== 'game_media_mix_group') {
            $result['errors'][] = 'スキーマ種別が一致しません（game_media_mix_group が必要です）。';
            return $result;
        }
        $incomingGroup = $incoming['game_media_mix_group'] ?? null;
        if (!is_array($incomingGroup) || (int) ($incomingGroup['id'] ?? 0) !== $group->id) {
            $result['errors'][] = 'メディアミックスグループIDが一致しません。エクスポートしたJSONを編集してください。';
            return $result;
        }

        $lock = $incoming['_meta']['lock'] ?? [];
        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_media_mix_group'] ?? null, $group->updated_at);
        if ($lockConflict) {
            $result['warnings'][] = 'メディアミックスグループ本体: エクスポート後に他で更新されています。内容を確認してください。';
        }

        $fields = [];
        foreach (self::FIELDS as $spec) {
            $f = MasterJsonFieldHelper::diffField($spec, $group->{$spec['key']}, $incomingGroup, $result['warnings'], 'メディアミックスグループ本体');
            if ($f !== null) {
                $fields[] = $f;
            }
        }
        $result['group'] = ['id' => $group->id, 'lock_conflict' => $lockConflict, 'fields' => $fields];
        if (!empty($fields)) {
            $result['has_changes'] = true;
        }

        return $result;
    }

    /**
     * @param array $accept ['media_mix_group_fields'=>[]]
     * @return array 実際に適用された差分（監査ログ用）
     * @throws \Throwable
     */
    public function apply(GameMediaMixGroup $group, string $rawJson, array $accept): array
    {
        $diff = $this->diff($group, $rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $applied = ['group' => []];
        $acceptedFields = $accept['media_mix_group_fields'] ?? [];

        DB::transaction(function () use ($group, $diff, $acceptedFields, &$applied) {
            foreach ($diff['group']['fields'] as $f) {
                if (in_array($f['key'], $acceptedFields, true)) {
                    $group->{$f['key']} = $f['raw_after'];
                    $applied['group'][] = $f;
                }
            }
            if ($group->isDirty()) {
                $group->save();
            }
        });

        return $applied;
    }
}
