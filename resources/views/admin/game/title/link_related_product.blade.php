@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Link Related Product</h4>
        </div>
        <div class="panel-body">
            <input type="text" class="form-control" id="admin-link-list-filter" value="{{ $defaultFilter ?? '' }}">
        </div>
        @include ('admin.all_errors')
        <form method="POST" action="{{ route('Admin.Game.Title.SyncRelatedProduct', $model) }}">
            @csrf

            <div class="panel-body panel-inverse">
                <div class="list-group" id="admin-link-list">
                @foreach ($relatedProducts as $rp)
                    <label class="list-group-item">
                        <input type="checkbox" name="game_related_product_ids[]" value="{{ $rp->id }}" class="form-check-input me-1" @checked(in_array($rp->id, $linkedRelatedProductIds))>
                        {{ $rp->name }}
                    </label>
                @endforeach
                </div>
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.Title.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection
