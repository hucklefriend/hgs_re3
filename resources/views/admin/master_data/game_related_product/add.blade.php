@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">New Related Product</h4>
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.RelatedProduct.Store') }}">
            {{ csrf_field() }}
            <div class="panel-body">
                @include('admin.master_data.game_related_product.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.MasterData.RelatedProduct') }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection
