@extends('layout')

@section('title', '問い合わせが見つかりません')
@section('current-node-title', '問い合わせが見つかりません')


@section('current-node-content')
    <div class="alert alert-danger">
        <p>
            問い合わせが見つかりませんでした。<br>
            URLが間違っているか、問い合わせが削除されている可能性があります。
        </p>
    </div>
@endsection
@section('nodes')

@endsection

