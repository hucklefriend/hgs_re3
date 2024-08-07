@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $franchise->name }}</h4>
        </div>
        <div class="panel-body">
            <ul>
                @foreach ($franchise->series as $series)
                    <li>
                        {{ $series->name }}シリーズ
                        <ul>
                            @foreach ($series->titles as $title)
                                <li>
                                    {{ $title->name }}
                                    <ul>
                                        @foreach ($title->packages as $package)
                                            <li>{{ $package->name }} ({{ $package->platform->acronym }})</li>
                                        @endforeach
                                    </ul>
                                </li>
                            @endforeach
                        </ul>
                    </li>
                @endforeach

                @foreach ($franchise->titles as $title)
                    <li>{{ $title->name }}
                        <ul>
                            @foreach ($title->packages as $package)
                                <li>
                                    {{ $package->name }} ({{ $package->platform->acronym }})
                                </li>
                            @endforeach
                        </ul>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
@endsection
