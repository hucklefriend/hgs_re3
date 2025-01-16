@php
    use Illuminate\Support\Facades\Request;
    use Illuminate\Support\Facades\Route;
@endphp
<!DOCTYPE html>
<html lang="ja" data-bs-theme="dark">
<head>
    <meta charset="utf-8">
    <title>{{ $controllerName }}.Admin.HGN</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <meta content="" name="description">
    <meta content="" name="author">
    <link rel="icon" href="{{ asset('favicon.ico') }}">

    <!-- ================== BEGIN core-css ================== -->
    <link href="{{ asset('assets/css/vendor.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/transparent/app.min.css') }}" rel="stylesheet">
    <!-- ================== END core-css ================== -->

    <!-- オリジナルCSS -->
    <link href="{{ asset('admin_assets/style.css') }}?{{ time() }}" rel="stylesheet">

    <!-- ================== BEGIN page-css ================== -->
    <link href="{{ asset('assets/plugins/jvectormap-next/jquery-jvectormap.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/plugins/bootstrap-datepicker/dist/css/bootstrap-datepicker.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/plugins/gritter/css/jquery.gritter.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/plugins/select2/dist/css/select2.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/plugins/jstree/dist/themes/default/style.min.css') }}" rel="stylesheet">
    <!-- ================== END page-css ================== -->
    <script>
        window.START_HGN = false;
    </script>
</head>
<body>
<!-- BEGIN page-cover -->
<div class="app-cover"></div>
<!-- END page-cover -->

<!-- BEGIN #loader -->
<div id="loader" class="app-loader">
    <span class="spinner"></span>
</div>
<!-- END #loader -->

<!-- BEGIN #app -->
<div id="app" class="app app-header-fixed app-sidebar-fixed ">
    <!-- BEGIN #header -->
    <div id="header" class="app-header">
        <!-- BEGIN navbar-header -->
        <div class="navbar-header">
            <a href="{{ route('Admin.Dashboard') }}" class="navbar-brand"><img src="{{ asset('admin_assets/logo.png') }}" class="navbar-logo-hgn"></img> <b class="me-1">H.G.N.</b> Admin</a>
            <button type="button" class="navbar-mobile-toggler" data-toggle="app-sidebar-mobile">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <!-- END navbar-header -->
        <!-- BEGIN header-nav -->
        <div class="navbar-nav">

            <div class="navbar-item navbar-user dropdown">
                <a href="#" class="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                    {{--<img src="../assets/img/user/user-13.jpg" alt="">--}}
                    <span style="width: 30px;height: 30px;margin: -5px 10px -5px 0;border-radius: 30px;text-align: center;padding-top:5px;">
                        <i class="fa fa-user"></i>
                    </span>
                    <span>
                        <span class="d-none d-md-inline">{{ $adminUser->name }}</span>
                        <b class="caret"></b>
                    </span>
                </a>
                <div class="dropdown-menu dropdown-menu-end me-1">
                    {{--
                    <a href="extra_profile.html" class="dropdown-item">Edit Profile</a>
                    <a href="email_inbox.html" class="dropdown-item d-flex align-items-center">
                        Inbox
                        <span class="badge bg-danger rounded-pill ms-auto pb-4px">2</span>
                    </a>
                    <a href="calendar.html" class="dropdown-item">Calendar</a>
                    --}}
                    <a href="{{ route('Entrance') }}" class="dropdown-item">Entrance</a>
                    <div class="dropdown-divider"></div>
                    <a href="{{ route('Admin.Logout') }}" class="dropdown-item">Log Out</a>
                </div>
            </div>
        </div>
        <!-- END header-nav -->
    </div>
    <!-- END #header -->

    <!-- BEGIN #content -->
    <div id="content" class="app-content">
        @php $pageTitle = ''; @endphp
        @if (Request::route()->getName() !== 'Admin')
        <!-- BEGIN breadcrumb -->
        <ol class="breadcrumb float-xl-end">
            @php $routeNames = []; @endphp
            @foreach (explode('.', Request::route()->getName()) as $route)
                @if($loop->last)
                    <li class="breadcrumb-item active">{{ $route }}</li>
                    @php $pageTitle = $route; @endphp
                @else
                    @php $routeNames[] = $route;$routeName = implode('.', $routeNames); @endphp

                    @isset($overwriteBreadcrumb[$route])
                        <li class="breadcrumb-item"><a href="{{ $overwriteBreadcrumb[$route] }}">{{ $route }}</a></li>
                    @elseif (Route::has($routeName))
                        <li class="breadcrumb-item"><a href="{{ route($routeName) }}">{{ $route }}</a></li>
                    @else
                        <li class="breadcrumb-item">{{ $route }}</li>
                    @endif
                @endif
            @endforeach
        </ol>
        <!-- END breadcrumb -->
        @endif
        <!-- BEGIN page-header -->
        <h1 class="page-header">@hasSection('title') @yield('title') @else {{ $pageTitle }} @endif</h1>
        <!-- END page-header -->

        @yield('content')

    </div>
    <!-- END #content -->

    <!-- BEGIN scroll-top-btn -->
    <a href="javascript:;" class="btn btn-icon btn-circle btn-theme btn-scroll-to-top" data-toggle="scroll-to-top"><i class="fa fa-angle-up"></i></a>
    <!-- END scroll-top-btn -->
</div>
<!-- END #app -->

<!-- ================== BEGIN core-js ================== -->
<script src="{{ asset('assets/js/vendor.min.js') }}"></script>
<script src="{{ asset('assets/js/app.min.js') }}"></script>
<!-- ================== END core-js ================== -->

<!-- ================== BEGIN page-js ================== -->
<script src="{{ asset('assets/plugins/gritter/js/jquery.gritter.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.canvaswrapper.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.colorhelpers.js') }}"></script>
<script src="{{ asset('assets/plugins/jquery-sparkline/jquery.sparkline.min.js') }}"></script>
<script src="{{ asset('assets/plugins/jvectormap-next/jquery-jvectormap.min.js') }}"></script>
<script src="{{ asset('assets/plugins/jvectormap-content/world-mill.js') }}"></script>
<script src="{{ asset('assets/plugins/bootstrap-datepicker/dist/js/bootstrap-datepicker.js') }}"></script>
<script src="{{ asset('assets/plugins/select2/dist/js/select2.min.js') }}"></script>
<script src="{{ asset('assets/plugins/jstree/dist/jstree.min.js') }}"></script>

<script src="{{ asset('admin_assets/common.js') }}"></script>
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

<!-- ================== END page-js ================== -->
</body>
</html>
