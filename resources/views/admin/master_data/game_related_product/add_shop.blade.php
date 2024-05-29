@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">New Related Product Shop</h4>
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.RelatedProduct.StoreShop', $relatedProduct) }}">
            {{ csrf_field() }}

            <div class="panel-body">
                @include('admin.master_data.game_related_product.form_shop')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.MasterData.RelatedProduct.Detail', $relatedProduct) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection
