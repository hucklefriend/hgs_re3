<?php

namespace App\Services\MasterJson;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * AI支援JSON更新機能で使うフィールド単位の cast/差分/表示ロジック
 *
 * フィールド定義（$spec）の形式:
 *   [
 *       'key'      => カラム名,
 *       'label'    => 画面表示用ラベル,
 *       'type'     => 'string'|'text'|'int'|'enum'|'fk',
 *       'required' => true のとき空値を不正値として扱う（省略時 false）,
 *       'maxlength'=> 文字数上限（省略可）,
 *       'enum'     => type=enum のときの enum クラス,
 *       'table'    => type=fk のときの参照先テーブル名,
 *   ]
 */
class MasterJsonFieldHelper
{
    /**
     * 取り込み値を検証・cast する
     *
     * @return array{valid: bool, value: mixed, error: ?string}
     */
    public static function castAndValidate(array $spec, mixed $raw): array
    {
        $label = $spec['label'];

        switch ($spec['type']) {
            case 'int':
                if ($raw === null || $raw === '') {
                    return ['valid' => false, 'value' => null, 'error' => "{$label}: 値が空です"];
                }
                if (!is_numeric($raw)) {
                    return ['valid' => false, 'value' => null, 'error' => "{$label}: 数値ではありません（{$raw}）"];
                }
                return ['valid' => true, 'value' => (int) $raw, 'error' => null];

            case 'enum':
                $enumClass = $spec['enum'];
                $resolved = self::resolveEnum($enumClass, $raw);
                if ($resolved === null) {
                    return ['valid' => false, 'value' => null, 'error' => "{$label}: 不明な値です（{$raw}）"];
                }
                return ['valid' => true, 'value' => $resolved, 'error' => null];

            case 'fk':
                if ($raw === null || $raw === '' || !is_numeric($raw)) {
                    return ['valid' => false, 'value' => null, 'error' => "{$label}: 値が不正です（{$raw}）"];
                }
                $id = (int) $raw;
                if (!DB::table($spec['table'])->where('id', $id)->exists()) {
                    return ['valid' => false, 'value' => null, 'error' => "{$label}: ID {$id} は存在しません"];
                }
                return ['valid' => true, 'value' => $id, 'error' => null];

            case 'text':
            case 'string':
            default:
                if ($raw !== null && !is_scalar($raw)) {
                    return ['valid' => false, 'value' => null, 'error' => "{$label}: 文字列ではありません"];
                }
                $value = $raw === null ? '' : (string) $raw;
                if (!empty($spec['required']) && trim($value) === '') {
                    return ['valid' => false, 'value' => null, 'error' => "{$label}: 必須項目が空です"];
                }
                if (!empty($spec['maxlength']) && mb_strlen($value) > $spec['maxlength']) {
                    return ['valid' => false, 'value' => null, 'error' => "{$label}: 文字数上限（{$spec['maxlength']}）を超えています"];
                }
                if (!empty($spec['regex']) && $value !== '' && !preg_match($spec['regex'], $value)) {
                    return ['valid' => false, 'value' => null, 'error' => "{$label}: 形式が不正です（{$value}）"];
                }
                return ['valid' => true, 'value' => $value, 'error' => null];
        }
    }

    /**
     * DBから取得した現在値を正規化する。
     * shop_id のように Eloquent の $casts で enum 化されていない列がある（生の int で保持されている）ため、
     * type=enum 指定のフィールドは値が enum インスタンスでなければここで解決する。
     */
    public static function normalizeCurrentValue(array $spec, mixed $value): mixed
    {
        if ($spec['type'] === 'enum' && !($value instanceof $spec['enum'])) {
            return self::resolveEnum($spec['enum'], $value) ?? $value;
        }
        return $value;
    }

    /**
     * enumの値を name（大文字小文字区別なし）または backed value から解決する
     */
    private static function resolveEnum(string $enumClass, mixed $raw): ?object
    {
        if ($raw instanceof $enumClass) {
            return $raw;
        }
        if (is_int($raw) || (is_string($raw) && ctype_digit($raw))) {
            $found = $enumClass::tryFrom((int) $raw);
            if ($found !== null) {
                return $found;
            }
        }
        if (is_string($raw)) {
            foreach ($enumClass::cases() as $case) {
                if (strcasecmp($case->name, $raw) === 0) {
                    return $case;
                }
            }
        }
        return null;
    }

    /**
     * 新規行（ショップ・パッケージ等）のフィールドを取り込みJSONから構築する
     *
     * @return array{fields: array, invalid: bool}
     */
    public static function buildCreateFields(array $fieldSpecs, array $incoming, string $rowLabel, array &$warnings): array
    {
        $fields = [];
        $invalid = false;

        foreach ($fieldSpecs as $spec) {
            if (!array_key_exists($spec['key'], $incoming)) {
                if (!empty($spec['required'])) {
                    $invalid = true;
                }
                continue;
            }
            $castResult = self::castAndValidate($spec, $incoming[$spec['key']]);
            if (!$castResult['valid']) {
                $warnings[] = "{$rowLabel}: {$castResult['error']}";
                $invalid = true;
                continue;
            }
            $fields[] = [
                'key'       => $spec['key'],
                'label'     => $spec['label'],
                'before'    => '(新規)',
                'after'     => self::displayValue($spec, $castResult['value']),
                'raw_after' => $castResult['value'],
            ];
        }

        return ['fields' => $fields, 'invalid' => $invalid];
    }

    /**
     * 現在値と取り込みJSONを比較し、差分があれば差分情報を返す
     * キーが存在しない場合は「変更なし」として null を返す
     *
     * @return array{key: string, label: string, before: string, after: string, raw_after: mixed}|null
     */
    public static function diffField(array $spec, mixed $currentValue, array $incoming, array &$warnings, string $rowLabel): ?array
    {
        $key = $spec['key'];
        if (!array_key_exists($key, $incoming)) {
            return null;
        }

        $currentValue = self::normalizeCurrentValue($spec, $currentValue);
        $result = self::castAndValidate($spec, $incoming[$key]);
        if (!$result['valid']) {
            $warnings[] = "{$rowLabel}: {$result['error']}（このフィールドは無視されました）";
            return null;
        }

        if (self::valuesEqual($spec, $currentValue, $result['value'])) {
            return null;
        }

        return [
            'key'       => $key,
            'label'     => $spec['label'],
            'before'    => self::displayValue($spec, $currentValue),
            'after'     => self::displayValue($spec, $result['value']),
            'raw_after' => $result['value'],
        ];
    }

    /**
     * 値が等しいか比較する（enumはcase単位、その他は緩く比較）
     */
    public static function valuesEqual(array $spec, mixed $a, mixed $b): bool
    {
        if ($spec['type'] === 'enum') {
            $aVal = $a instanceof \UnitEnum ? $a->name : $a;
            $bVal = $b instanceof \UnitEnum ? $b->name : $b;
            return $aVal === $bVal;
        }
        if ($spec['type'] === 'int' || $spec['type'] === 'fk') {
            return (int) $a === (int) $b;
        }
        return (string) $a === (string) $b;
    }

    /**
     * 画面表示用の文字列に変換する
     */
    public static function displayValue(array $spec, mixed $value): string
    {
        if ($value === null) {
            return '(空)';
        }
        if ($value instanceof \UnitEnum) {
            $text = self::enumDisplayText($value);
            return $text !== null ? "{$value->name}（{$text}）" : $value->name;
        }
        if ($value === '') {
            return '(空)';
        }
        if ($spec['type'] === 'fk') {
            $name = DB::table($spec['table'])->where('id', $value)->value('name');
            return $name !== null ? "{$value}（{$name}）" : (string) $value;
        }
        return (string) $value;
    }

    /**
     * JSON出力用に値をシリアライズする
     */
    public static function exportValue(array $spec, mixed $value): mixed
    {
        if ($value instanceof \UnitEnum) {
            return $value->name;
        }
        return $value;
    }

    /**
     * enumの表示用テキストを取得する
     * ※ Shop enumは name プロパティ（case名）とは別に表示名を返す name() メソッドを持つ特殊なケース
     */
    public static function enumDisplayText(\UnitEnum $value): ?string
    {
        if ($value instanceof \App\Enums\Shop) {
            return $value->name();
        }
        if (method_exists($value, 'text')) {
            return $value->text();
        }
        return null;
    }

    /**
     * lock情報（エクスポート時のupdated_at）と現在のupdated_atを比較し、競合しているか判定する
     */
    public static function isLockConflict(?string $lockedUpdatedAt, ?Carbon $currentUpdatedAt): bool
    {
        if ($lockedUpdatedAt === null || $currentUpdatedAt === null) {
            return false;
        }
        try {
            $locked = Carbon::parse($lockedUpdatedAt);
        } catch (\Throwable) {
            return false;
        }
        return !$locked->equalTo($currentUpdatedAt);
    }
}
