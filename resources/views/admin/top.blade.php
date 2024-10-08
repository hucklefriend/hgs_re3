@extends('admin.layout')

@section('content')

    Auth::check()の結果: @php var_dump(\Illuminate\Support\Facades\Auth::guard('web')->check()) @endphp

@endsection
