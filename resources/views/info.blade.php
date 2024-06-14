@section('content-node-title', 'お知らせ')

@section('content-node-body')
    <section style="margin-bottom:20px;">
        <h1>{!! $info->head !!}</h1>
    </section>

    {!! $info->body !!}
@endsection
