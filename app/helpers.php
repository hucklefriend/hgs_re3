<?php

function menu_active(string $match, bool $isPerfectMatch = false): string
{
    if ($isPerfectMatch) {
        return (Request::route()->getName() === $match) ? 'active' : '';
    } else {
        return str_starts_with(Request::route()->getName(), $match) ? 'active' : '';
    }
}




/**
 * checkboxとradioボタンのchecked判定
 *
 * @param $val1
 * @param $val2
 * @return string
 */
function checked($val1, $val2)
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
function selected($val1, $val2)
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
function cut_new_line($text)
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
