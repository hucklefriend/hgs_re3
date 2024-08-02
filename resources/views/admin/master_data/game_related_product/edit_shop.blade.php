@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">更新</h4>
        </div>
        <form method="POST" action="{{ route('Admin.Game.RelatedProduct.UpdateShop', ['relatedProduct' => $relatedProduct, 'shop_id' => $model->shop_id]) }}">
            {{ method_field('PUT') }}
            @csrf

            <div class="panel-body">
                @include('admin.master_data.game_related_product.form_shop')
            </div>
            <div class="panel-footer text-end">
                <div class="panel-footer text-end">
                    <a href="{{ route('Admin.Game.RelatedProduct.Detail', $relatedProduct) }}" class="btn btn-default">Cancel</a>&nbsp;
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </div>
        </form>
    </div>
@endsection
