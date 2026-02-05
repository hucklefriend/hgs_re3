@extends('layout')

@section('title', '怖さメーター')
@section('current-node-title', '怖さメーター')

@section('nodes')
    <section class="node" id="password-change-form-node">
        <div class="node-head">
            <h2 class="node-head-text">{{ $title->name }}</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            @if (session('success'))
                <div class="alert alert-success mt-3">
                    {{ session('success') }}
                </div>
            @endif

            <form action="{{ route('User.FearMeter.Form.Store') }}" method="POST">
                @csrf
                <input type="hidden" name="title_key" value="{{ $title->key }}">

                @foreach (\App\Enums\FearMeter::cases() as $case)
                <div class="mb-3 flex items-center gap-2">
                    <input type="radio" name="fear_meter" value="{{ $case->value }}" id="fear_meter_{{ $case->value }}" @if (isset($fearMeter) && $fearMeter->fear_meter === $case) checked @endif>
                    <label for="fear_meter_{{ $case->value }}">{{ $case->text() }}</label>
                </div>
                @endforeach

                <div class="form-group" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-success">入力</button>
                </div>
            </form>
        </div>
    </section>
    @include('common.shortcut')
@endsection


