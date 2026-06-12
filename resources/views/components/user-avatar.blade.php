@props(['user'])

@if($user->avatar_filename)
    <img src="{{ $user->getAvatarUrl() }}"
         alt="{{ $user->name }}"
         {{ $attributes }}>
@else
    @php $initial = mb_strtoupper(mb_substr($user->name, 0, 1)) @endphp
    <svg viewBox="0 0 100 100" aria-label="{{ $user->name }}" role="img"
         {{ $attributes }}>
        <defs>
            <filter id="av-glow-{{ $user->id }}">
                <feGaussianBlur stdDeviation="6" result="b"/>
                <feMerge>
                    <feMergeNode in="b"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <rect width="100" height="100" fill="#333"/>
        <text x="50" y="50" dominant-baseline="central" text-anchor="middle"
              font-size="50" fill="#6ee7b7"
              filter="url(#av-glow-{{ $user->id }})" dy="-0.05em">{{ $initial }}</text>
    </svg>
@endif
