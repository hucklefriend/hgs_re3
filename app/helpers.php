<?php

use App\Enums\UserRole;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * ログインユーザーが管理者かどうかを判定する
 *
 * @return bool 管理者ならtrue、未ログインまたは管理者以外ならfalse
 */
function is_admin_user(): bool
{
    if (!Auth::check()) {
        return false;
    }

    return Auth::user()->role === UserRole::ADMIN;
}

/**
 * メニューのアクティブ状態を設定
 *
 * @param string $match
 * @param bool $isPerfectMatch
 * @return string
 */
function menu_active(string $match, bool $isPerfectMatch = false): string
{
    if ($isPerfectMatch) {
        return (Request::route()->getName() === $match) ? 'active' : '';
    } else {
        if (Request::route()->getName() === $match) {
            return 'active';
        }

        return str_starts_with(Request::route()->getName(), $match . '.') ? 'active' : '';
    }
}


/**
 * checkboxとradioボタンのchecked判定
 *
 * @param $val1
 * @param $val2
 * @return string
 */
function checked($val1, $val2): string
{
    if ($val1 == $val2) {
        return ' checked';
    }

    return '';
}

/**
 * invalid判定
 *
 * @param $errors
 * @param $formName
 * @return string
 */
function invalid($errors, $formName): string
{
    if ($errors->has($formName)) {
        return ' is-invalid';
    }

    return '';
}

/**
 * @param $val1
 * @param $val2
 * @return string
 */
function selected($val1, $val2): string
{
    if ($val1 == $val2) {
        return ' selected';
    }

    return '';
}

/**
 * checkboxとradioボタンのchecked判定
 *
 * @param $val1
 * @param $val2
 * @return string
 */
function active($val1, $val2)
{
    if ($val1 == $val2) {
        return ' active';
    }

    return '';
}

/**
 * 必要以上に多い改行を取り除く
 *
 * @param $text
 * @return string
 */
function cut_new_line($text): string
{
    return trim(preg_replace("/(\r\n){3,}|\r{3,}|\n{3,}/", "\n\n", $text));
}

/**
 * 全角英数字を半角に、半角カタカナを全角カタカナに変換する
 *
 * @param string $synonym 変換するシノニム文字列
 * @return string 変換後のシノニム文字列
 */
function synonym(string $synonym): string
{
    // $synonymの全角英数字を半角に、半角カタカナは全角カタカナにする
    // さらに半角・全角スペースを消す
    $synonym = preg_replace('/[ 　]/u', '', $synonym);
    return strtoupper(mb_convert_kana($synonym, 'aKV'));
}

/**
 * 配列の中身にsynonymを適用
 *
 * @param array $words
 * @return void
 */
function array_walk_synonym(array &$words): void
{
    array_walk($words, function (&$value, $key){
        $value = synonym($value);
    });
}

/**
 * 内部URLをasset関数で変換する
 *
 * @param string $url
 * @return string
 */
function conv_asset_url(string $url): string
{
    if (preg_match('/^%ASSET%\/(.*)/', $url, $matches)) {
        return asset($matches[1]);
    } else {
        return $url;
    }
}
