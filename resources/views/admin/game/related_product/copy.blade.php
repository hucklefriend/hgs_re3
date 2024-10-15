@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Copy Related Product: {{ $relatedProduct->name }}</h4>
        </div>
        <form method="POST" action="{{ route('Admin.Game.RelatedProduct.MakeCopy', $relatedProduct) }}">
            @csrf
            <div class="panel-body">
                @include('admin.game.related_product.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.RelatedProduct.Detail', $relatedProduct) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection
