@php
    $siteName = $siteName ?? 'ホラーゲームネットワーク(α)';
    $ogpTitle = $ogpTitle ?? $siteName;
    $ogpDescription = $ogpDescription ?? '';
    $ogpImage = $ogpImage ?? asset('images/ogp.png');
    $ogpUrl = $ogpUrl ?? url()->current();
    $ogpType = $ogpType ?? 'website';
@endphp
<meta property="og:title" content="{{ $ogpTitle }}">
<meta property="og:description" content="{{ $ogpDescription }}">
<meta property="og:url" content="{{ $ogpUrl }}">
<meta property="og:type" content="{{ $ogpType }}">
<meta property="og:site_name" content="{{ $siteName }}">
@if(!empty($ogpImage))
<meta property="og:image" content="{{ $ogpImage }}">
@endif
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{{ $ogpTitle }}">
<meta name="twitter:description" content="{{ $ogpDescription }}">
@if(!empty($ogpImage))
<meta name="twitter:image" content="{{ $ogpImage }}">
@endif