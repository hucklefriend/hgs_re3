@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $parent->name }}</h4>
        </div>
        <form method="POST" action="{{ route('Admin.Game.Series.SaveNetwork', $parent) }}">
            @csrf

            <div id="edit-network">
                <div id="parent">
                    <div class="draggable">
                        <span>{{ $parent->name }}</span>
                    </div>

                    @foreach($children as $child)
                        <div class="draggable">
                            <span>{!! $child->node_name !!}</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </form>
    </div>
@endsection

@section('js')
    <script src="{{ asset('admin_assets/interact.min.js') }}"></script>

    <script>
        const parent = document.getElementById('parent');

        // target elements with the "draggable" class
        interact('.draggable')
            .draggable({
                // enable inertial throwing
                inertia: true,
                // keep the element within the area of it's parent
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                ],
                // enable autoScroll
                autoScroll: true,

                listeners: {
                    // call this function on every dragmove event
                    move: dragMoveListener,

                    // call this function on every dragend event
                    end (event) {
                        var textEl = event.target.querySelector('p')

                        textEl && (textEl.textContent =
                            'moved a distance of ' +
                            (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                                Math.pow(event.pageY - event.y0, 2) | 0))
                                .toFixed(2) + 'px')
                    }
                }
            })

        function dragMoveListener (event) {
            var target = event.target
            // keep the dragged position in the data-x/data-y attributes
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

            // translate the element
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

            // update the posiion attributes
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)

            // 親領域を広げるロジック
            const rect = target.getBoundingClientRect();
            const parentRect = parent.getBoundingClientRect();

            if (rect.right > parentRect.right || rect.bottom > parentRect.bottom) {
                parent.style.width = `${Math.max(parentRect.width, rect.right - parentRect.left)}px`;
                parent.style.height = `${Math.max(parentRect.height, rect.bottom - parentRect.top)}px`;
            }
        }

        // this function is used later in the resizing and gesture demos
        window.dragMoveListener = dragMoveListener;
    </script>
@endsection
