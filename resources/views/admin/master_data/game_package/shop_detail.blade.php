@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $package->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('管理-マスター-パッケージショップ更新', [$package, $shop]) }}" class="btn btn-default"><i class="fas fa-edit"></i></a>
            </div>
            <table class="table">
                <tr>
                    <th>ショップ</th>
                    <td>{{ $shop->shop()->name }}</td>
                </tr>
                <tr>
                    <th>URL</th>
                    <td><a href="{{ $shop->shop_url }}" target="_blank">{{ $shop->shop_url }}</a></td>
                </tr>
                <tr>
                    <th>画像(小)</th>
                    <td>
                        @empty($shop->small_image_url)
                            -
                        @else
                            @switch ($shop->shop())
                                @case (\Hgs3\Enums\Game\Shop::Amazon)
                                {!! $shop->small_image_url !!}
                                @break

                                @default
                                <img src="{{ $shop->small_image_url }}">
                                @break
                            @endswitch
                        @endempty
                    </td>
                </tr>
                <tr>
                    <th>画像(中)</th>
                    <td>
                        @empty($shop->medium_image_url)
                            -
                        @else
                            @switch ($shop->shop())
                                @case (\Hgs3\Enums\Game\Shop::Amazon)
                                {!! $shop->medium_image_url !!}
                                @break

                                @default
                                <img src="{{ $shop->medium_image_url }}">
                                @break
                            @endswitch
                        @endempty
                    </td>
                </tr>
                <tr>
                    <th>画像(大)</th>
                    <td>
                        @empty($shop->large_image_url)
                            -
                        @else
                            @switch ($shop->shop())
                                @case (\Hgs3\Enums\Game\Shop::Amazon)
                                {!! $shop->large_image_url !!}
                                @break

                                @default
                                <img src="{{ $shop->large_image_url }}">
                                @break
                            @endswitch
                        @endempty
                    </td>
                </tr>
                <tr>
                    <th>発売日(数値)</th>
                    <td>{{ $shop->release_int }}</td>
                </tr>
                <tr>
                    <th>R指定</th>
                    <td>
                        {{ \Hgs3\Enums\RatedR::tryFrom($shop->is_adult)->text() }}
                    </td>
                </tr>
                @switch ($shop->shop())
                    @case (\Hgs3\Enums\Game\Shop::Amazon)
                    <tr>
                        <th>ASIN</th>
                        <td>{{ $shop->param1 }}</td>
                    </tr>
                    @break
                @endswitch
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('管理-マスター-パッケージショップ削除', [$package, $shop]) }}" onsubmit="return confirm('削除します');">
                    {{ csrf_field() }}
                    {{ method_field('DELETE') }}
                    <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i></button>
                </form>
            </div>
        </div>
    </div>
@endsection
