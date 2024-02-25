<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Color Admin | Dashboard V1</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
    <meta content="" name="description" />
    <meta content="" name="author" />

    <!-- ================== BEGIN core-css ================== -->
    <link href="{{ asset('assets/css/vendor.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/css/transparent/app.min.css') }}" rel="stylesheet" />
    <!-- ================== END core-css ================== -->

    <!-- ================== BEGIN page-css ================== -->
    <link href="{{ asset('assets/plugins/jvectormap-next/jquery-jvectormap.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/plugins/bootstrap-datepicker/dist/css/bootstrap-datepicker.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/plugins/gritter/css/jquery.gritter.css') }}" rel="stylesheet" />
    <!-- ================== END page-css ================== -->
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
            <a href="index.html" class="navbar-brand"><span class="navbar-logo"></span> <b class="me-1">Color</b> Admin</a>
            <button type="button" class="navbar-mobile-toggler" data-toggle="app-sidebar-mobile">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <!-- END navbar-header -->
        <!-- BEGIN header-nav -->
        <div class="navbar-nav">
            <div class="navbar-item navbar-form">
                <form action="" method="POST" name="search">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Enter keyword" />
                        <button type="submit" class="btn btn-search"><i class="fa fa-search"></i></button>
                    </div>
                </form>
            </div>
            <div class="navbar-item dropdown">
                <a href="#" data-bs-toggle="dropdown" class="navbar-link dropdown-toggle icon">
                    <i class="fa fa-bell"></i>
                    <span class="badge">5</span>
                </a>
                <div class="dropdown-menu media-list dropdown-menu-end">
                    <div class="dropdown-header">NOTIFICATIONS (5)</div>
                    <a href="javascript:;" class="dropdown-item media">
                        <div class="media-left">
                            <i class="fa fa-bug media-object bg-gray-500"></i>
                        </div>
                        <div class="media-body">
                            <h6 class="media-heading">Server Error Reports <i class="fa fa-exclamation-circle text-danger"></i></h6>
                            <div class="text-muted fs-10px">3 minutes ago</div>
                        </div>
                    </a>
                    <a href="javascript:;" class="dropdown-item media">
                        <div class="media-left">
                            <img src="../assets/img/user/user-1.jpg" class="media-object" alt="" />
                            <i class="fab fa-facebook-messenger text-blue media-object-icon"></i>
                        </div>
                        <div class="media-body">
                            <h6 class="media-heading">John Smith</h6>
                            <p>Quisque pulvinar tellus sit amet sem scelerisque tincidunt.</p>
                            <div class="text-muted fs-10px">25 minutes ago</div>
                        </div>
                    </a>
                    <a href="javascript:;" class="dropdown-item media">
                        <div class="media-left">
                            <img src="../assets/img/user/user-2.jpg" class="media-object" alt="" />
                            <i class="fab fa-facebook-messenger text-blue media-object-icon"></i>
                        </div>
                        <div class="media-body">
                            <h6 class="media-heading">Olivia</h6>
                            <p>Quisque pulvinar tellus sit amet sem scelerisque tincidunt.</p>
                            <div class="text-muted fs-10px">35 minutes ago</div>
                        </div>
                    </a>
                    <a href="javascript:;" class="dropdown-item media">
                        <div class="media-left">
                            <i class="fa fa-plus media-object bg-gray-500"></i>
                        </div>
                        <div class="media-body">
                            <h6 class="media-heading"> New User Registered</h6>
                            <div class="text-muted fs-10px">1 hour ago</div>
                        </div>
                    </a>
                    <a href="javascript:;" class="dropdown-item media">
                        <div class="media-left">
                            <i class="fa fa-envelope media-object bg-gray-500"></i>
                            <i class="fab fa-google text-warning media-object-icon fs-14px"></i>
                        </div>
                        <div class="media-body">
                            <h6 class="media-heading"> New Email From John</h6>
                            <div class="text-muted fs-10px">2 hour ago</div>
                        </div>
                    </a>
                    <div class="dropdown-footer text-center">
                        <a href="javascript:;" class="text-decoration-none">View more</a>
                    </div>
                </div>
            </div>
            <div class="navbar-item navbar-user dropdown">
                <a href="#" class="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                    <img src="../assets/img/user/user-13.jpg" alt="" />
                    <span>
							<span class="d-none d-md-inline">Adam Schwartz</span>
							<b class="caret"></b>
						</span>
                </a>
                <div class="dropdown-menu dropdown-menu-end me-1">
                    <a href="extra_profile.html" class="dropdown-item">Edit Profile</a>
                    <a href="email_inbox.html" class="dropdown-item d-flex align-items-center">
                        Inbox
                        <span class="badge bg-danger rounded-pill ms-auto pb-4px">2</span>
                    </a>
                    <a href="calendar.html" class="dropdown-item">Calendar</a>
                    <a href="extra_settings_page.html" class="dropdown-item">Settings</a>
                    <div class="dropdown-divider"></div>
                    <a href="login.html" class="dropdown-item">Log Out</a>
                </div>
            </div>
        </div>
        <!-- END header-nav -->
    </div>
    <!-- END #header -->

    <!-- BEGIN #sidebar -->
    <div id="sidebar" class="app-sidebar">
        <!-- BEGIN scrollbar -->
        <div class="app-sidebar-content" data-scrollbar="true" data-height="100%">
            <!-- BEGIN menu -->
            <div class="menu">
                <div class="menu-profile">
                    <a href="javascript:;" class="menu-profile-link" data-toggle="app-sidebar-profile" data-target="#appSidebarProfileMenu">
                        <div class="menu-profile-cover with-shadow"></div>
                        <div class="menu-profile-image">
                            <img src="../assets/img/user/user-13.jpg" alt="" />
                        </div>
                        <div class="menu-profile-info">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    Sean Ngu
                                </div>
                                <div class="menu-caret ms-auto"></div>
                            </div>
                            <small>Frontend developer</small>
                        </div>
                    </a>
                </div>
                <div id="appSidebarProfileMenu" class="collapse">
                    <div class="menu-item pt-5px">
                        <a href="javascript:;" class="menu-link">
                            <div class="menu-icon"><i class="fa fa-cog"></i></div>
                            <div class="menu-text">Settings</div>
                        </a>
                    </div>
                    <div class="menu-item">
                        <a href="javascript:;" class="menu-link">
                            <div class="menu-icon"><i class="fa fa-pencil-alt"></i></div>
                            <div class="menu-text"> Send Feedback</div>
                        </a>
                    </div>
                    <div class="menu-item pb-5px">
                        <a href="javascript:;" class="menu-link">
                            <div class="menu-icon"><i class="fa fa-question-circle"></i></div>
                            <div class="menu-text"> Helps</div>
                        </a>
                    </div>
                    <div class="menu-divider m-0"></div>
                </div>
                <div class="menu-header">Navigation</div>
                <div class="menu-item has-sub active">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-sitemap"></i>							</div>
                        <div class="menu-text">Dashboard</div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item active">
                            <a href="index.html" class="menu-link"><div class="menu-text">Dashboard v1</div></a>
                        </div>
                        <div class="menu-item">
                            <a href="index_v2.html" class="menu-link"><div class="menu-text">Dashboard v2</div></a>
                        </div>
                        <div class="menu-item">
                            <a href="index_v3.html" class="menu-link"><div class="menu-text">Dashboard v3</div></a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-hdd"></i>
                        </div>
                        <div class="menu-text">Email</div>
                        <div class="menu-badge">10</div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="email_inbox.html" class="menu-link">
                                <div class="menu-text">Inbox</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="email_compose.html" class="menu-link">
                                <div class="menu-text">Compose</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="email_detail.html" class="menu-link">
                                <div class="menu-text">Detail</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item">
                    <a href="widget.html" class="menu-link">
                        <div class="menu-icon">
                            <i class="fab fa-simplybuilt"></i>
                        </div>
                        <div class="menu-text">Widgets <span class="menu-label">NEW</span></div>
                    </a>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-gem"></i>
                        </div>
                        <div class="menu-text">UI Elements <span class="menu-label">NEW</span></div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="ui_general.html" class="menu-link">
                                <div class="menu-text">General <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_typography.html" class="menu-link">
                                <div class="menu-text">Typography</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_tabs_accordions.html" class="menu-link">
                                <div class="menu-text">Tabs & Accordions</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_unlimited_tabs.html" class="menu-link">
                                <div class="menu-text">Unlimited Nav Tabs</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_modal_notification.html" class="menu-link">
                                <div class="menu-text">Modal & Notification <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_widget_boxes.html" class="menu-link">
                                <div class="menu-text">Widget Boxes</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_media_object.html" class="menu-link">
                                <div class="menu-text">Media Object</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_buttons.html" class="menu-link">
                                <div class="menu-text">Buttons <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_icon_fontawesome.html" class="menu-link">
                                <div class="menu-text">FontAwesome</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_icon_bootstrap.html" class="menu-link">
                                <div class="menu-text">Bootstrap Icons <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_icon_duotone.html" class="menu-link">
                                <div class="menu-text">Duotone Icons <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_icon_simple_line_icons.html" class="menu-link">
                                <div class="menu-text">Simple Line Icons</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_icon_ionicons.html" class="menu-link">
                                <div class="menu-text">Ionicons</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_tree.html" class="menu-link">
                                <div class="menu-text">Tree View</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_language_bar_icon.html" class="menu-link">
                                <div class="menu-text">Language Bar & Icon</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_social_buttons.html" class="menu-link">
                                <div class="menu-text">Social Buttons</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_tour.html" class="menu-link">
                                <div class="menu-text">Intro JS</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="ui_offcanvas_toasts.html" class="menu-link">
                                <div class="menu-text">Offcanvas & Toasts <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item ">
                    <a href="bootstrap_5.html" class="menu-link">
                        <div class="menu-icon-img">
                            <img src="../assets/img/logo/logo-bs5.png" alt="" />
                        </div>
                        <div class="menu-text">Bootstrap 5 <span class="menu-label">NEW</span></div>
                    </a>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-list-ol"></i>
                        </div>
                        <div class="menu-text">Form Stuff <span class="menu-label">NEW</span></div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="form_elements.html" class="menu-link">
                                <div class="menu-text">Form Elements <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="form_plugins.html" class="menu-link">
                                <div class="menu-text">Form Plugins <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="form_slider_switcher.html" class="menu-link">
                                <div class="menu-text">Form Slider + Switcher</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="form_validation.html" class="menu-link">
                                <div class="menu-text">Form Validation</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="form_wizards.html" class="menu-link">
                                <div class="menu-text">Wizards <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="form_wysiwyg.html" class="menu-link">
                                <div class="menu-text">WYSIWYG</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="form_editable.html" class="menu-link">
                                <div class="menu-text">X-Editable</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="form_multiple_upload.html" class="menu-link">
                                <div class="menu-text">Multiple File Upload</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="form_summernote.html" class="menu-link">
                                <div class="menu-text">Summernote</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="form_dropzone.html" class="menu-link">
                                <div class="menu-text">Dropzone</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-table"></i>
                        </div>
                        <div class="menu-text">Tables</div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="table_basic.html" class="menu-link">
                                <div class="menu-text">Basic Tables</div>
                            </a>
                        </div>
                        <div class="menu-item has-sub">
                            <a href="javascript:;" class="menu-link">
                                <div class="menu-text">Managed Tables</div>
                                <div class="menu-caret"></div>
                            </a>
                            <div class="menu-submenu">
                                <div class="menu-item">
                                    <a href="table_manage.html" class="menu-link">
                                        <div class="menu-text">Default</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_buttons.html" class="menu-link">
                                        <div class="menu-text">Buttons</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_colreorder.html" class="menu-link">
                                        <div class="menu-text">ColReorder</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_fixed_columns.html" class="menu-link">
                                        <div class="menu-text">Fixed Column</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_fixed_header.html" class="menu-link">
                                        <div class="menu-text">Fixed Header</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_keytable.html" class="menu-link">
                                        <div class="menu-text">KeyTable</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_responsive.html" class="menu-link">
                                        <div class="menu-text">Responsive</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_rowreorder.html" class="menu-link">
                                        <div class="menu-text">RowReorder</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_scroller.html" class="menu-link">
                                        <div class="menu-text">Scroller</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_select.html" class="menu-link">
                                        <div class="menu-text">Select</div>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="table_manage_combine.html" class="menu-link">
                                        <div class="menu-text">Extension Combination</div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-cash-register"></i>
                        </div>
                        <div class="menu-text">POS System <span class="menu-label">NEW</span></div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="pos_customer_order.html" target="_blank" class="menu-link">
                                <div class="menu-text">Customer Order</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="pos_kitchen_order.html" target="_blank" class="menu-link">
                                <div class="menu-text">Kitchen Order</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="pos_counter_checkout.html" target="_blank" class="menu-link">
                                <div class="menu-text">Counter Checkout</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="pos_table_booking.html" target="_blank" class="menu-link">
                                <div class="menu-text">Table Booking</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="pos_menu_stock.html" target="_blank" class="menu-link">
                                <div class="menu-text">Menu Stock</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-star"></i>
                        </div>
                        <div class="menu-text">Front End <span class="menu-label">NEW</span></div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="../../../frontend/template/template_one_page_parallax/index.html" target="_blank" class="menu-link">
                                <div class="menu-text">One Page Parallax</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../../../frontend/template/template_blog/index.html" target="_blank" class="menu-link">
                                <div class="menu-text">Blog</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../../../frontend/template/template_forum/index.html" target="_blank" class="menu-link">
                                <div class="menu-text">Forum</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../../../frontend/template/template_e_commerce/index.html" target="_blank" class="menu-link">
                                <div class="menu-text">E-Commerce</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../../../frontend/template/template_corporate/index.html" target="_blank" class="menu-link">
                                <div class="menu-text">Corporate <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-envelope"></i>
                        </div>
                        <div class="menu-text">Email Template</div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="email_system.html" class="menu-link">
                                <div class="menu-text">System Template</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="email_newsletter.html" class="menu-link">
                                <div class="menu-text">Newsletter Template</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-chart-pie"></i>
                        </div>
                        <div class="menu-text">Chart</div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="chart-flot.html" class="menu-link">
                                <div class="menu-text">Flot Chart</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="chart-js.html" class="menu-link">
                                <div class="menu-text">Chart JS</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="chart-d3.html" class="menu-link">
                                <div class="menu-text">d3 Chart</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="chart-apex.html" class="menu-link">
                                <div class="menu-text">Apex Chart</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item">
                    <a href="calendar.html" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-calendar"></i>
                        </div>
                        <div class="menu-text">Calendar</div>
                    </a>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-map"></i>
                        </div>
                        <div class="menu-text">Map</div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="map_vector.html" class="menu-link">
                                <div class="menu-text">Vector Map</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="map_google.html" class="menu-link">
                                <div class="menu-text">Google Map</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-image"></i>
                        </div>
                        <div class="menu-text">Gallery</div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="gallery.html" class="menu-link">
                                <div class="menu-text">Gallery v1</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="gallery_v2.html" class="menu-link">
                                <div class="menu-text">Gallery v2</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-cogs"></i>
                        </div>
                        <div class="menu-text">Page Options <span class="menu-label">NEW</span></div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="page_blank.html" class="menu-link">
                                <div class="menu-text">Blank Page</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_footer.html" class="menu-link">
                                <div class="menu-text">Page with Footer</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_fixed_footer.html" class="menu-link">
                                <div class="menu-text">Page with Fixed Footer <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_without_sidebar.html" class="menu-link">
                                <div class="menu-text">Page without Sidebar</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_right_sidebar.html" class="menu-link">
                                <div class="menu-text">Page with Right Sidebar</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_minified_sidebar.html" class="menu-link">
                                <div class="menu-text">Page with Minified Sidebar</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_two_sidebar.html" class="menu-link">
                                <div class="menu-text">Page with Two Sidebar</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_line_icons.html" class="menu-link">
                                <div class="menu-text">Page with Line Icons</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_ionicons.html" class="menu-link">
                                <div class="menu-text">Page with Ionicons</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_full_height.html" class="menu-link">
                                <div class="menu-text">Full Height Content</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_wide_sidebar.html" class="menu-link">
                                <div class="menu-text">Page with Wide Sidebar</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_mega_menu.html" class="menu-link">
                                <div class="menu-text">Page with Mega Menu</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_top_menu.html" class="menu-link">
                                <div class="menu-text">Page with Top Menu</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_boxed_layout.html" class="menu-link">
                                <div class="menu-text">Page with Boxed Layout</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_mixed_menu.html" class="menu-link">
                                <div class="menu-text">Page with Mixed Menu</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_boxed_layout_with_mixed_menu.html" class="menu-link">
                                <div class="menu-text">Boxed Layout with Mixed Menu</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_search_sidebar.html" class="menu-link">
                                <div class="menu-text">Page with Search Sidebar <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="page_with_hover_sidebar.html" class="menu-link">
                                <div class="menu-text">Page with Hover Sidebar <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-gift"></i>
                        </div>
                        <div class="menu-text">Extra <span class="menu-label">NEW</span></div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="extra_timeline.html" class="menu-link">
                                <div class="menu-text">Timeline</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_coming_soon.html" class="menu-link">
                                <div class="menu-text">Coming Soon Page</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_search_results.html" class="menu-link">
                                <div class="menu-text">Search Results</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_invoice.html" class="menu-link">
                                <div class="menu-text">Invoice</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_404_error.html" class="menu-link">
                                <div class="menu-text">404 Error Page</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_profile.html" class="menu-link">
                                <div class="menu-text">Profile Page</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_scrum_board.html" class="menu-link">
                                <div class="menu-text">Scrum Board <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_cookie_acceptance_banner.html" class="menu-link">
                                <div class="menu-text">Cookie Acceptance Banner <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_orders.html" class="menu-link">
                                <div class="menu-text">Orders <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_order_details.html" class="menu-link">
                                <div class="menu-text">Order Details <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_products.html" class="menu-link">
                                <div class="menu-text">Products <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_product_details.html" class="menu-link">
                                <div class="menu-text">Product Details <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_file_manager.html" class="menu-link">
                                <div class="menu-text">File Manager <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_pricing_page.html" class="menu-link">
                                <div class="menu-text">Pricing Page <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_messenger_page.html" class="menu-link">
                                <div class="menu-text">Messenger Page <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_data_management.html" class="menu-link">
                                <div class="menu-text">Data Management <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="extra_settings_page.html" class="menu-link">
                                <div class="menu-text">Settings Page <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-key"></i>
                        </div>
                        <div class="menu-text">Login & Register</div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="login.html" class="menu-link">
                                <div class="menu-text">Login</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="login_v2.html" class="menu-link">
                                <div class="menu-text">Login v2</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="login_v3.html" class="menu-link">
                                <div class="menu-text">Login v3</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="register_v3.html" class="menu-link">
                                <div class="menu-text">Register v3</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-cubes"></i>
                        </div>
                        <div class="menu-text">Version <span class="menu-label">NEW</span></div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="../template_html/index_v3.html" class="menu-link">
                                <div class="menu-text">HTML</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_ajax/" class="menu-link">
                                <div class="menu-text">AJAX</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_angularjs/" class="menu-link">
                                <div class="menu-text">ANGULAR JS</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_angularjs17/" class="menu-link">
                                <div class="menu-text">ANGULAR JS 17</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="javascript:alert('Laravel 10 Version only available in downloaded version.');" class="menu-link">
                                <div class="menu-text">LARAVEL 10</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_vuejs/" class="menu-link">
                                <div class="menu-text">VUE 3 + Vite JS</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_react/" class="menu-link">
                                <div class="menu-text">REACT 18</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="javascript:alert('.NET Core 7.0 MVC Version only available in downloaded version.');" class="menu-link">
                                <div class="menu-text">ASP.NET <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_material/index_v3.html" class="menu-link">
                                <div class="menu-text">MATERIAL DESIGN</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_apple/index_v3.html" class="menu-link">
                                <div class="menu-text">APPLE DESIGN</div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_transparent/index_v3.html" class="menu-link">
                                <div class="menu-text">TRANSPARENT DESIGN <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_facebook/index_v3.html" class="menu-link">
                                <div class="menu-text">FACEBOOK DESIGN <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="../template_google/index_v3.html" class="menu-link">
                                <div class="menu-text">GOOGLE DESIGN <i class="fa fa-paper-plane text-theme"></i></div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-medkit"></i>
                        </div>
                        <div class="menu-text">Helper</div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item">
                            <a href="helper_css.html" class="menu-link">
                                <div class="menu-text">Predefined CSS Classes</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="menu-item has-sub">
                    <a href="javascript:;" class="menu-link">
                        <div class="menu-icon">
                            <i class="fa fa-align-left"></i>
                        </div>
                        <div class="menu-text">Menu Level</div>
                        <div class="menu-caret"></div>
                    </a>
                    <div class="menu-submenu">
                        <div class="menu-item has-sub">
                            <a href="javascript:;" class="menu-link">
                                <div class="menu-text">Menu 1.1</div>
                                <div class="menu-caret"></div>
                            </a>
                            <div class="menu-submenu">
                                <div class="menu-item has-sub">
                                    <a href="javascript:;" class="menu-link">
                                        <div class="menu-text">Menu 2.1</div>
                                        <div class="menu-caret"></div>
                                    </a>
                                    <div class="menu-submenu">
                                        <div class="menu-item"><a href="javascript:;" class="menu-link"><div class="menu-text">Menu 3.1</div></a></div>
                                        <div class="menu-item"><a href="javascript:;" class="menu-link"><div class="menu-text">Menu 3.2</div></a></div>
                                    </div>
                                </div>
                                <div class="menu-item"><a href="javascript:;" class="menu-link"><div class="menu-text">Menu 2.2</div></a></div>
                                <div class="menu-item"><a href="javascript:;" class="menu-link"><div class="menu-text">Menu 2.3</div></a></div>
                            </div>
                        </div>
                        <div class="menu-item"><a href="javascript:;" class="menu-link"><div class="menu-text">Menu 1.2</div></a></div>
                        <div class="menu-item"><a href="javascript:;" class="menu-link"><div class="menu-text">Menu 1.3</div></a></div>
                    </div>
                </div>

                <!-- BEGIN minify-button -->
                <div class="menu-item d-flex">
                    <a href="javascript:;" class="app-sidebar-minify-btn ms-auto d-flex align-items-center text-decoration-none" data-toggle="app-sidebar-minify"><i class="fa fa-angle-double-left"></i></a>
                </div>
                <!-- END minify-button -->
            </div>
            <!-- END menu -->
        </div>
        <!-- END scrollbar -->
    </div>
    <div class="app-sidebar-bg"></div>
    <div class="app-sidebar-mobile-backdrop"><a href="#" data-dismiss="app-sidebar-mobile" class="stretched-link"></a></div>
    <!-- END #sidebar -->

    <!-- BEGIN #content -->
    <div id="content" class="app-content">
        <!-- BEGIN breadcrumb -->
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item"><a href="javascript:;">Home</a></li>
            <li class="breadcrumb-item active">Dashboard</li>
        </ol>
        <!-- END breadcrumb -->
        <!-- BEGIN page-header -->
        <h1 class="page-header">Dashboard <small>header small text goes here...</small></h1>
        <!-- END page-header -->

        <!-- BEGIN row -->
        <div class="row">
            <!-- BEGIN col-3 -->
            <div class="col-xl-3 col-md-6">
                <div class="widget widget-stats bg-blue">
                    <div class="stats-icon"><i class="fa fa-desktop"></i></div>
                    <div class="stats-info">
                        <h4>TOTAL VISITORS</h4>
                        <p>3,291,922</p>
                    </div>
                    <div class="stats-link">
                        <a href="javascript:;">View Detail <i class="fa fa-arrow-alt-circle-right"></i></a>
                    </div>
                </div>
            </div>
            <!-- END col-3 -->
            <!-- BEGIN col-3 -->
            <div class="col-xl-3 col-md-6">
                <div class="widget widget-stats bg-info">
                    <div class="stats-icon"><i class="fa fa-link"></i></div>
                    <div class="stats-info">
                        <h4>BOUNCE RATE</h4>
                        <p>20.44%</p>
                    </div>
                    <div class="stats-link">
                        <a href="javascript:;">View Detail <i class="fa fa-arrow-alt-circle-right"></i></a>
                    </div>
                </div>
            </div>
            <!-- END col-3 -->
            <!-- BEGIN col-3 -->
            <div class="col-xl-3 col-md-6">
                <div class="widget widget-stats bg-orange">
                    <div class="stats-icon"><i class="fa fa-users"></i></div>
                    <div class="stats-info">
                        <h4>UNIQUE VISITORS</h4>
                        <p>1,291,922</p>
                    </div>
                    <div class="stats-link">
                        <a href="javascript:;">View Detail <i class="fa fa-arrow-alt-circle-right"></i></a>
                    </div>
                </div>
            </div>
            <!-- END col-3 -->
            <!-- BEGIN col-3 -->
            <div class="col-xl-3 col-md-6">
                <div class="widget widget-stats bg-red">
                    <div class="stats-icon"><i class="fa fa-clock"></i></div>
                    <div class="stats-info">
                        <h4>AVG TIME ON SITE</h4>
                        <p>00:12:23</p>
                    </div>
                    <div class="stats-link">
                        <a href="javascript:;">View Detail <i class="fa fa-arrow-alt-circle-right"></i></a>
                    </div>
                </div>
            </div>
            <!-- END col-3 -->
        </div>
        <!-- END row -->

        <!-- BEGIN row -->
        <div class="row">
            <!-- BEGIN col-8 -->
            <div class="col-xl-8">
                <!-- BEGIN panel -->
                <div class="panel panel-inverse" data-sortable-id="index-1">
                    <div class="panel-heading">
                        <h4 class="panel-title">Website Analytics (Last 7 Days)</h4>
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-success" data-toggle="panel-reload"><i class="fa fa-redo"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                        </div>
                    </div>
                    <div class="panel-body pe-1">
                        <div id="interactive-chart" class="h-300px"></div>
                    </div>
                </div>
                <!-- END panel -->

                <!-- BEGIN tabs -->
                <ul class="nav nav-tabs nav-tabs-inverse nav-justified" data-sortable-id="index-2">
                    <li class="nav-item"><a href="#latest-post" data-bs-toggle="tab" class="nav-link active"><i class="fa fa-camera fa-lg me-5px"></i> <span class="d-none d-md-inline">Latest Post</span></a></li>
                    <li class="nav-item"><a href="#purchase" data-bs-toggle="tab" class="nav-link"><i class="fa fa-archive fa-lg me-5px"></i> <span class="d-none d-md-inline">Purchase</span></a></li>
                    <li class="nav-item"><a href="#email" data-bs-toggle="tab" class="nav-link"><i class="fa fa-envelope fa-lg me-5px"></i> <span class="d-none d-md-inline">Email</span></a></li>
                </ul>
                <div class="tab-content panel rounded-0 rounded-bottom mb-20px" data-sortable-id="index-3">
                    <div class="tab-pane fade active show" id="latest-post">
                        <div class="h-300px p-3" data-scrollbar="true">
                            <div class="d-sm-flex">
                                <a href="javascript:;" class="w-sm-200px">
                                    <img class="mw-100 rounded" src="../assets/img/gallery/gallery-1.jpg" alt="" />
                                </a>
                                <div class="flex-1 ps-sm-3 pt-3 pt-sm-0">
                                    <h5 class="text-white">Aenean viverra arcu nec pellentesque ultrices. In erat purus, adipiscing nec lacinia at, ornare ac eros.</h5>
                                    Nullam at risus metus. Quisque nisl purus, pulvinar ut mauris vel, elementum suscipit eros. Praesent ornare ante massa, egestas pellentesque orci convallis ut. Curabitur consequat convallis est, id luctus mauris lacinia vel. Nullam tristique lobortis mauris, ultricies fermentum lacus bibendum id. Proin non ante tortor. Suspendisse pulvinar ornare tellus nec pulvinar. Nam pellentesque accumsan mi, non pellentesque sem convallis sed. Quisque rutrum erat id auctor gravida.
                                </div>
                            </div>
                            <hr class="bg-gray-500" />
                            <div class="d-sm-flex">
                                <a href="javascript:;" class="w-sm-200px">
                                    <img class="mw-100 rounded" src="../assets/img/gallery/gallery-10.jpg" alt="" />
                                </a>
                                <div class="flex-1 ps-sm-3 pt-3 pt-sm-0">
                                    <h5 class="text-white">Vestibulum vitae diam nec odio dapibus placerat. Ut ut lorem justo.</h5>
                                    Fusce bibendum augue nec fermentum tempus. Sed laoreet dictum tempus. Aenean ac sem quis nulla malesuada volutpat. Nunc vitae urna pulvinar velit commodo cursus. Nullam eu felis quis diam adipiscing hendrerit vel ac turpis. Nam mattis fringilla euismod. Donec eu ipsum sit amet mauris iaculis aliquet. Quisque sit amet feugiat odio. Cras convallis lorem at libero lobortis, placerat lobortis sapien lacinia. Duis sit amet elit bibendum sapien dignissim bibendum.
                                </div>
                            </div>
                            <hr class="bg-gray-500" />
                            <div class="d-sm-flex">
                                <a href="javascript:;" class="w-sm-200px">
                                    <img class="mw-100 rounded" src="../assets/img/gallery/gallery-7.jpg" alt="" />
                                </a>
                                <div class="flex-1 ps-sm-3 pt-3 pt-sm-0">
                                    <h5 class="text-white">Maecenas eget turpis luctus, scelerisque arcu id, iaculis urna. Interdum et malesuada fames ac ante ipsum primis in faucibus.</h5>
                                    Morbi placerat est nec pharetra placerat. Ut laoreet nunc accumsan orci aliquam accumsan. Maecenas volutpat dolor vitae sapien ultricies fringilla. Suspendisse vitae orci sed nibh ultrices tristique. Aenean in ante eget urna semper imperdiet. Pellentesque sagittis a nulla at scelerisque. Nam augue nulla, accumsan quis nisi a, facilisis eleifend nulla. Praesent aliquet odio non imperdiet fringilla. Morbi a porta nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.
                                </div>
                            </div>
                            <hr class="bg-gray-500" />
                            <div class="d-sm-flex">
                                <a href="javascript:;" class="w-sm-200px">
                                    <img class="mw-100 rounded" src="../assets/img/gallery/gallery-8.jpg" alt="" />
                                </a>
                                <div class="flex-1 ps-sm-3 pt-3 pt-sm-0">
                                    <h5 class="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor accumsan rutrum.</h5>
                                    Fusce augue diam, vestibulum a mattis sit amet, vehicula eu ipsum. Vestibulum eu mi nec purus tempor consequat. Vestibulum porta non mi quis cursus. Fusce vulputate cursus magna, tincidunt sodales ipsum lobortis tincidunt. Mauris quis lorem ligula. Morbi placerat est nec pharetra placerat. Ut laoreet nunc accumsan orci aliquam accumsan. Maecenas volutpat dolor vitae sapien ultricies fringilla. Suspendisse vitae orci sed nibh ultrices tristique. Aenean in ante eget urna semper imperdiet. Pellentesque sagittis a nulla at scelerisque.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="purchase">
                        <div class="h-300px" data-scrollbar="true">
                            <table class="table table-panel mb-0">
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th class="hidden-sm text-center">Product</th>
                                    <th></th>
                                    <th>Amount</th>
                                    <th>User</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td class="fw-bold text-muted">13/02/2023</td>
                                    <td class="hidden-sm text-center">
                                        <a href="javascript:;">
                                            <img src="../assets/img/product/product-1.png" alt="" width="32px"  />
                                        </a>
                                    </td>
                                    <td class="text-nowrap">
                                        <h6><a href="javascript:;" class="text-white text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
                                    </td>
                                    <td class="text-blue fw-bold">$349.00</td>
                                    <td class="text-nowrap"><a href="javascript:;" class="text-white text-decoration-none">Derick Wong</a></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold text-muted">13/02/2023</td>
                                    <td class="hidden-sm text-center">
                                        <a href="javascript:;">
                                            <img src="../assets/img/product/product-2.png" alt="" width="32px" />
                                        </a>
                                    </td>
                                    <td class="text-nowrap">
                                        <h6><a href="javascript:;" class="text-white text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
                                    </td>
                                    <td class="text-blue fw-bold">$399.00</td>
                                    <td class="text-nowrap"><a href="javascript:;" class="text-white text-decoration-none">Derick Wong</a></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold text-muted">13/02/2023</td>
                                    <td class="hidden-sm text-center">
                                        <a href="javascript:;">
                                            <img src="../assets/img/product/product-3.png" alt="" width="32px" />
                                        </a>
                                    </td>
                                    <td class="text-nowrap">
                                        <h6><a href="javascript:;" class="text-white text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
                                    </td>
                                    <td class="text-blue fw-bold">$499.00</td>
                                    <td class="text-nowrap"><a href="javascript:;" class="text-white text-decoration-none">Derick Wong</a></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold text-muted">13/02/2023</td>
                                    <td class="hidden-sm text-center">
                                        <a href="javascript:;">
                                            <img src="../assets/img/product/product-4.png" alt="" width="32px" />
                                        </a>
                                    </td>
                                    <td class="text-nowrap">
                                        <h6><a href="javascript:;" class="text-white text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
                                    </td>
                                    <td class="text-blue fw-bold">$230.00</td>
                                    <td class="text-nowrap"><a href="javascript:;" class="text-white text-decoration-none">Derick Wong</a></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold text-muted">13/02/2023</td>
                                    <td class="hidden-sm text-center">
                                        <a href="javascript:;">
                                            <img src="../assets/img/product/product-5.png" alt="" width="32px" />
                                        </a>
                                    </td>
                                    <td class="text-nowrap">
                                        <h6><a href="javascript:;" class="text-white text-decoration-none">Nunc eleifend lorem eu velit eleifend, <br />eget faucibus nibh placerat.</a></h6>
                                    </td>
                                    <td class="text-blue fw-bold">$500.00</td>
                                    <td class="text-nowrap"><a href="javascript:;" class="text-white text-decoration-none">Derick Wong</a></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="email">
                        <div class="h-300px p-3" data-scrollbar="true">
                            <div class="d-flex">
                                <a class="w-60px" href="javascript:;">
                                    <img src="../assets/img/user/user-1.jpg" alt="" class="mw-100 rounded-pill" />
                                </a>
                                <div class="flex-1 ps-3">
                                    <a href="javascript:;" class="text-white text-decoration-none"><h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5></a>
                                    <p class="mb-5px">
                                        Aenean mollis arcu sed turpis accumsan dignissim. Etiam vel tortor at risus tristique convallis. Donec adipiscing euismod arcu id euismod. Suspendisse potenti. Aliquam lacinia sapien ac urna placerat, eu interdum mauris viverra.
                                    </p>
                                    <span class="text-muted fs-11px fw-bold">Received on 04/16/2023, 12.39pm</span>
                                </div>
                            </div>
                            <hr class="bg-gray-500" />
                            <div class="d-flex">
                                <a class="w-60px" href="javascript:;">
                                    <img src="../assets/img/user/user-2.jpg" alt="" class="mw-100 rounded-pill" />
                                </a>
                                <div class="flex-1 ps-3">
                                    <a href="javascript:;" class="text-white text-decoration-none"><h5>Praesent et sem porta leo tempus tincidunt eleifend et arcu.</h5></a>
                                    <p class="mb-5px">
                                        Proin adipiscing dui nulla. Duis pharetra vel sem ac adipiscing. Vestibulum ut porta leo. Pellentesque orci neque, tempor ornare purus nec, fringilla venenatis elit. Duis at est non nisl dapibus lacinia.
                                    </p>
                                    <span class="text-muted fs-11px fw-bold">Received on 04/16/2023, 12.39pm</span>
                                </div>
                            </div>
                            <hr class="bg-gray-500" />
                            <div class="d-flex">
                                <a class="w-60px" href="javascript:;">
                                    <img src="../assets/img/user/user-3.jpg" alt="" class="mw-100 rounded-pill" />
                                </a>
                                <div class="flex-1 ps-3">
                                    <a href="javascript:;" class="text-white text-decoration-none"><h5>Ut mi eros, varius nec mi vel, consectetur convallis diam.</h5></a>
                                    <p class="mb-5px">
                                        Ut mi eros, varius nec mi vel, consectetur convallis diam. Nullam eget hendrerit eros. Duis lacinia condimentum justo at ultrices. Phasellus sapien arcu, fringilla eu pulvinar id, mattis quis mauris.
                                    </p>
                                    <span class="text-muted fs-11px fw-bold">Received on 04/16/2023, 12.39pm</span>
                                </div>
                            </div>
                            <hr class="bg-gray-500" />
                            <div class="d-flex">
                                <a class="w-60px" href="javascript:;">
                                    <img src="../assets/img/user/user-4.jpg" alt="" class="mw-100 rounded-pill" />
                                </a>
                                <div class="flex-1 ps-3">
                                    <a href="javascript:;" class="text-white text-decoration-none"><h5>Aliquam nec dolor vel nisl dictum ullamcorper.</h5></a>
                                    <p class="mb-5px">
                                        Aliquam nec dolor vel nisl dictum ullamcorper. Duis vel magna enim. Aenean volutpat a dui vitae pulvinar. Nullam ligula mauris, dictum eu ullamcorper quis, lacinia nec mauris.
                                    </p>
                                    <span class="text-muted fs-11px fw-bold">Received on 04/16/2023, 12.39pm</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END tabs -->

                <!-- BEGIN panel -->
                <div class="panel panel-inverse" data-sortable-id="index-4">
                    <div class="panel-heading">
                        <h4 class="panel-title">Quick Post</h4>
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-success" data-toggle="panel-reload"><i class="fa fa-redo"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                        </div>
                    </div>
                    <div class="panel-toolbar">
                        <div class="btn-group me-5px">
                            <a class="btn btn-white" href="javascript:;"><i class="fa fa-bold"></i></a>
                            <a class="btn btn-white active" href="javascript:;"><i class="fa fa-italic"></i></a>
                            <a class="btn btn-white" href="javascript:;"><i class="fa fa-underline"></i></a>
                        </div>
                        <div class="btn-group">
                            <a class="btn btn-white" href="javascript:;"><i class="fa fa-align-left"></i></a>
                            <a class="btn btn-white active" href="javascript:;"><i class="fa fa-align-center"></i></a>
                            <a class="btn btn-white" href="javascript:;"><i class="fa fa-align-right"></i></a>
                            <a class="btn btn-white" href="javascript:;"><i class="fa fa-align-justify"></i></a>
                        </div>
                    </div>
                    <hr class="m-0" />
                    <textarea class="form-control rounded-0 border-0 shadow-none bg-light p-3" rows="14">Enter some comment.</textarea>
                    <div class="panel-footer text-end">
                        <a href="javascript:;" class="btn btn-white btn-sm">Cancel</a>
                        <a href="javascript:;" class="btn btn-primary btn-sm ms-5px">Action</a>
                    </div>
                </div>
                <!-- END panel -->

                <!-- BEGIN panel -->
                <div class="panel panel-inverse" data-sortable-id="index-5">
                    <div class="panel-heading">
                        <h4 class="panel-title">Message</h4>
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-success" data-toggle="panel-reload"><i class="fa fa-redo"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                        </div>
                    </div>
                    <div class="panel-body p-0">
                        <div class="h-300px p-3" data-scrollbar="true">
                            <div class="d-flex">
                                <a href="javascript:;" class="w-60px">
                                    <img src="../assets/img/user/user-5.jpg" alt="" class="mw-100 rounded-pill" />
                                </a>
                                <div class="flex-1 ps-3">
                                    <h5 class="text-white">John Doe</h5>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id nunc non eros fermentum vestibulum ut id felis. Nunc molestie libero eget urna aliquet, vitae laoreet felis ultricies. Fusce sit amet massa malesuada, tincidunt augue vitae, gravida felis.</p>
                                </div>
                            </div>
                            <hr class="bg-gray-500" />
                            <div class="d-flex">
                                <a href="javascript:;" class="w-60px">
                                    <img src="../assets/img/user/user-6.jpg" alt="" class="mw-100 rounded-pill" />
                                </a>
                                <div class="flex-1 ps-3">
                                    <h5 class="text-white">Terry Ng</h5>
                                    <p>Sed in ante vel ipsum tristique euismod posuere eget nulla. Quisque ante sem, scelerisque iaculis interdum quis, eleifend id mi. Fusce congue leo nec mauris malesuada, id scelerisque sapien ultricies.</p>
                                </div>
                            </div>
                            <hr class="bg-gray-500" />
                            <div class="d-flex">
                                <a href="javascript:;" class="w-60px">
                                    <img src="../assets/img/user/user-8.jpg" alt="" class="mw-100 rounded-pill" />
                                </a>
                                <div class="flex-1 ps-3">
                                    <h5 class="text-white">Fiona Log</h5>
                                    <p>Pellentesque dictum in tortor ac blandit. Nulla rutrum eu leo vulputate ornare. Nulla a semper mi, ac lacinia sapien. Sed volutpat ornare eros, vel semper sem sagittis in. Quisque risus ipsum, iaculis quis cursus eu, tristique sed nulla.</p>
                                </div>
                            </div>
                            <hr class="bg-gray-500" />
                            <div class="d-flex">
                                <a href="javascript:;" class="w-60px">
                                    <img src="../assets/img/user/user-7.jpg" alt="" class="mw-100 rounded-pill" />
                                </a>
                                <div class="flex-1 ps-3">
                                    <h5 class="text-white">John Doe</h5>
                                    <p>Morbi molestie lorem quis accumsan elementum. Morbi condimentum nisl iaculis, laoreet risus sed, porta neque. Proin mi leo, dapibus at ligula a, aliquam consectetur metus.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel-footer">
                        <form>
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Enter message" />
                                <button class="btn btn-primary" type="button"><i class="fa fa-pencil-alt"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
                <!-- END panel -->
            </div>
            <!-- END col-8 -->
            <!-- BEGIN col-4 -->
            <div class="col-xl-4">
                <!-- BEGIN panel -->
                <div class="panel panel-inverse" data-sortable-id="index-6">
                    <div class="panel-heading">
                        <h4 class="panel-title">Analytics Details</h4>
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-success" data-toggle="panel-reload"><i class="fa fa-redo"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-panel align-middle mb-0">
                            <thead>
                            <tr>
                                <th>Source</th>
                                <th>Total</th>
                                <th>Trend</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td nowrap><label class="badge bg-danger">Unique Visitor</label></td>
                                <td>13,203 <span class="text-success"><i class="fa fa-arrow-up"></i></span></td>
                                <td><div id="sparkline-unique-visitor"></div></td>
                            </tr>
                            <tr>
                                <td nowrap><label class="badge bg-warning">Bounce Rate</label></td>
                                <td>28.2%</td>
                                <td><div id="sparkline-bounce-rate"></div></td>
                            </tr>
                            <tr>
                                <td nowrap><label class="badge bg-success">Total Page Views</label></td>
                                <td>1,230,030</td>
                                <td><div id="sparkline-total-page-views"></div></td>
                            </tr>
                            <tr>
                                <td nowrap><label class="badge bg-blue">Avg Time On Site</label></td>
                                <td>00:03:45</td>
                                <td><div id="sparkline-avg-time-on-site"></div></td>
                            </tr>
                            <tr>
                                <td nowrap><label class="badge bg-default text-gray-900">% New Visits</label></td>
                                <td>40.5%</td>
                                <td><div id="sparkline-new-visits"></div></td>
                            </tr>
                            <tr>
                                <td nowrap><label class="badge bg-gray-900">Return Visitors</label></td>
                                <td>73.4%</td>
                                <td><div id="sparkline-return-visitors"></div></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- END panel -->

                <!-- BEGIN panel -->
                <div class="panel panel-inverse" data-sortable-id="index-7">
                    <div class="panel-heading">
                        <h4 class="panel-title">Visitors User Agent</h4>
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-success" data-toggle="panel-reload"><i class="fa fa-redo"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div id="donut-chart" class="h-300px"></div>
                    </div>
                </div>
                <!-- END panel -->

                <!-- BEGIN panel -->
                <div class="panel panel-inverse" data-sortable-id="index-8">
                    <div class="panel-heading">
                        <h4 class="panel-title">Todo List</h4>
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-success" data-toggle="panel-reload"><i class="fa fa-redo"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                        </div>
                    </div>
                    <div class="panel-body p-0">
                        <div class="todolist">
                            <div class="todolist-item active">
                                <div class="todolist-input">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" id="todolist1" data-change="todolist" checked />
                                    </div>
                                </div>
                                <label class="todolist-label" for="todolist1">Donec vehicula pretium nisl, id lacinia nisl tincidunt id.</label>
                            </div>
                            <div class="todolist-item">
                                <div class="todolist-input">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" id="todolist2" data-change="todolist" />
                                    </div>
                                </div>
                                <label class="todolist-label" for="todolist2">Duis a ullamcorper massa.</label>
                            </div>
                            <div class="todolist-item">
                                <div class="todolist-input">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" id="todolist3" data-change="todolist" />
                                    </div>
                                </div>
                                <label class="todolist-label" for="todolist3">Phasellus bibendum, odio nec vestibulum ullamcorper.</label>
                            </div>
                            <div class="todolist-item">
                                <div class="todolist-input">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" id="todolist4" data-change="todolist" />
                                    </div>
                                </div>
                                <label class="todolist-label" for="todolist4">Duis pharetra mi sit amet dictum congue.</label>
                            </div>
                            <div class="todolist-item">
                                <div class="todolist-input">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" id="todolist5" data-change="todolist" />
                                    </div>
                                </div>
                                <label class="todolist-label" for="todolist5">Duis pharetra mi sit amet dictum congue.</label>
                            </div>
                            <div class="todolist-item">
                                <div class="todolist-input">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" id="todolist6" data-change="todolist" />
                                    </div>
                                </div>
                                <label class="todolist-label" for="todolist6">Phasellus bibendum, odio nec vestibulum ullamcorper.</label>
                            </div>
                            <div class="todolist-item">
                                <div class="todolist-input">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" id="todolist7" data-change="todolist" />
                                    </div>
                                </div>
                                <label class="todolist-label" for="todolist7">Donec vehicula pretium nisl, id lacinia nisl tincidunt id.</label>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END panel -->

                <!-- BEGIN panel -->
                <div class="panel panel-inverse bg-white bg-opacity-20" data-sortable-id="index-9">
                    <div class="panel-heading">
                        <h4 class="panel-title">World Visitors</h4>
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-success" data-toggle="panel-reload"><i class="fa fa-redo"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                        </div>
                    </div>
                    <div class="panel-body p-0">
                        <div id="world-map" class="h-300px" data-theme="transparent"></div>
                    </div>
                </div>
                <!-- END panel -->

                <!-- BEGIN panel -->
                <div class="panel panel-inverse" data-sortable-id="index-10">
                    <div class="panel-heading">
                        <h4 class="panel-title">Calendar</h4>
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-success" data-toggle="panel-reload"><i class="fa fa-redo"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div id="datepicker-inline" class="datepicker-full-width overflow-y-scroll position-relative"><div></div></div>
                    </div>
                </div>
                <!-- END panel -->
            </div>
            <!-- END col-4 -->
        </div>
        <!-- END row -->
    </div>
    <!-- END #content -->

    <!-- BEGIN theme-panel -->
    <div class="theme-panel">
        <a href="javascript:;" data-toggle="theme-panel-expand" class="theme-collapse-btn"><i class="fa fa-cog"></i></a>
        <div class="theme-panel-content" data-scrollbar="true" data-height="100%">
            <h5>App Settings</h5>

            <!-- BEGIN theme-list -->
            <div class="theme-list">
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-red" data-theme-class="theme-red" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Red">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-pink" data-theme-class="theme-pink" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Pink">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-orange" data-theme-class="theme-orange" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Orange">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-yellow" data-theme-class="theme-yellow" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Yellow">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-lime" data-theme-class="theme-lime" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Lime">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-green" data-theme-class="theme-green" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Green">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-teal" data-theme-class="theme-teal" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Teal">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-cyan" data-theme-class="theme-cyan" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Cyan">&nbsp;</a></div>
                <div class="theme-list-item active"><a href="javascript:;" class="theme-list-link bg-blue" data-theme-class="" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Default">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-purple" data-theme-class="theme-purple" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Purple">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-indigo" data-theme-class="theme-indigo" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Indigo">&nbsp;</a></div>
                <div class="theme-list-item"><a href="javascript:;" class="theme-list-link bg-black" data-theme-class="theme-gray-600" data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-container="body" data-bs-title="Black">&nbsp;</a></div>
            </div>
            <!-- END theme-list -->

            <div class="theme-panel-divider"></div>

            <div class="row mt-10px">
                <div class="col-8 control-label  fw-bold">
                    <div>Dark Mode <span class="badge bg-primary ms-1 py-2px position-relative" style="top: -1px;">NEW</span></div>
                    <div class="lh-14">
                        <small class="text-white opacity-50">
                            Adjust the appearance to reduce glare and give your eyes a break.
                        </small>
                    </div>
                </div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-theme-dark-mode" id="appThemeDarkMode" value="1" />
                        <label class="form-check-label" for="appThemeDarkMode">&nbsp;</label>
                    </div>
                </div>
            </div>

            <div class="theme-panel-divider"></div>

            <!-- BEGIN theme-switch -->
            <div class="row mt-10px align-items-center">
                <div class="col-8 control-label  fw-bold">Header Fixed</div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-header-fixed" id="appHeaderFixed" value="1" checked />
                        <label class="form-check-label" for="appHeaderFixed">&nbsp;</label>
                    </div>
                </div>
            </div>
            <div class="row mt-10px align-items-center">
                <div class="col-8 control-label  fw-bold">Sidebar Fixed</div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-sidebar-fixed" id="appSidebarFixed" value="1" checked />
                        <label class="form-check-label" for="appSidebarFixed">&nbsp;</label>
                    </div>
                </div>
            </div>
            <div class="row mt-10px align-items-center">
                <div class="col-8 control-label  fw-bold">Sidebar Grid</div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-sidebar-grid" id="appSidebarGrid" value="1" />
                        <label class="form-check-label" for="appSidebarGrid">&nbsp;</label>
                    </div>
                </div>
            </div>
            <div class="row mt-10px align-items-center">
                <div class="col-8 control-label  fw-bold">Gradient Enabled</div>
                <div class="col-4 d-flex">
                    <div class="form-check form-switch ms-auto mb-0">
                        <input type="checkbox" class="form-check-input" name="app-gradient-enabled" id="appGradientEnabled" value="1" />
                        <label class="form-check-label" for="appGradientEnabled">&nbsp;</label>
                    </div>
                </div>
            </div>
            <!-- END theme-switch -->

            <div class="theme-panel-divider"></div>

            <h5>Admin Design (5)</h5>
            <!-- BEGIN theme-version -->
            <div class="theme-version">
                <div class="theme-version-item">
                    <a href="../template_html/index_v2.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/default.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_transparent/index_v2.html" class="theme-version-link active">
                        <span style="background-image: url(../assets/img/theme/transparent.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_apple/index_v2.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/apple.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_material/index_v2.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/material.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_facebook/index_v2.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/facebook.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_google/index_v2.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/google.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
            </div>
            <!-- END theme-version -->

            <div class="theme-panel-divider"></div>

            <h5>Language Version (7)</h5>
            <!-- BEGIN theme-version -->
            <div class="theme-version">
                <div class="theme-version-item">
                    <a href="../template_html/index.html" class="theme-version-link active">
                        <span style="background-image: url(../assets/img/version/html.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_ajax/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/version/ajax.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_angularjs/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/version/angular1x.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_angularjs17/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/version/angular10x.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="javascript:alert('Laravel 10 Version only available in downloaded version.');" class="theme-version-link">
                        <span style="background-image: url(../assets/img/version/laravel.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_vue3/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/version/vuejs.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../template_react/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/version/reactjs.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="javascript:alert('.NET Core 7.0 MVC Version only available in downloaded version.');" class="theme-version-link">
                        <span style="background-image: url(../assets/img/version/dotnet.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
            </div>
            <!-- END theme-version -->

            <div class="theme-panel-divider"></div>

            <h5>Frontend Design (5)</h5>
            <!-- BEGIN theme-version -->
            <div class="theme-version">
                <div class="theme-version-item">
                    <a href="../../../frontend/template/template_one_page_parallax/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/one-page-parallax.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../../../frontend/template/template_e_commerce/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/e-commerce.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../../../frontend/template/template_blog/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/blog.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../../../frontend/template/template_forum/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/forum.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
                <div class="theme-version-item">
                    <a href="../../../frontend/template/template_corporate/index.html" class="theme-version-link">
                        <span style="background-image: url(../assets/img/theme/corporate.jpg);" class="theme-version-cover"></span>
                    </a>
                </div>
            </div>
            <!-- END theme-version -->

            <div class="theme-panel-divider"></div>

            <a href="https://seantheme.com/color-admin/documentation/" class="btn btn-yellow d-block w-100 rounded-pill mb-10px" target="_blank"><b>Documentation</b></a>
            <a href="javascript:;" class="btn btn-default d-block w-100 rounded-pill" data-toggle="reset-local-storage"><b>Reset Local Storage</b></a>
        </div>
    </div>
    <!-- END theme-panel -->
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
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.saturated.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.browser.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.drawSeries.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.uiConstants.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.time.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.resize.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.pie.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.crosshair.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.categories.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.navigate.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.touchNavigate.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.hover.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.touch.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.selection.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.symbol.js') }}"></script>
<script src="{{ asset('assets/plugins/flot/source/jquery.flot.legend.js') }}"></script>
<script src="{{ asset('assets/plugins/jquery-sparkline/jquery.sparkline.min.js') }}"></script>
<script src="{{ asset('assets/plugins/jvectormap-next/jquery-jvectormap.min.js') }}"></script>
<script src="{{ asset('assets/plugins/jvectormap-content/world-mill.js') }}"></script>
<script src="{{ asset('assets/plugins/bootstrap-datepicker/dist/js/bootstrap-datepicker.js') }}"></script>
<script src="{{ asset('assets/js/demo/dashboard.js') }}"></script>
<!-- ================== END page-js ================== -->
</body>
</html>
