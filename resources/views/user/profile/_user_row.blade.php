@php
    $isMe = $me && $me->id === $u->id;
    $isFollowingUser = in_array($u->id, $myFollowingIds, true);
@endphp
<div class="flex items-center gap-3 border border-slate-700 rounded p-2">
    <x-user-avatar :user="$u" class="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
    <div class="min-w-0 flex-1">
        <a href="{{ route('User.Profile.Show', $u->show_id) }}"
           class="font-semibold text-slate-100 hover:text-sky-400 block truncate"
           data-hgn-scope="full">{{ $u->name }}</a>
        <span class="text-slate-500 text-xs">@{{ $u->show_id }}</span>
    </div>
    @if ($me && !$isMe)
        <button type="button"
                class="js-follow-toggle btn btn-sm flex-shrink-0 {{ $isFollowingUser ? 'btn-secondary' : 'btn-outline' }}"
                data-show-id="{{ $u->show_id }}"
                data-active="{{ $isFollowingUser ? '1' : '0' }}"
                data-label-on="フォロー解除"
                data-label-off="フォローする"
                data-url-on="{{ route('api.users.unfollow', $u->show_id) }}"
                data-url-off="{{ route('api.users.follow', $u->show_id) }}"
                data-method-on="DELETE"
                data-method-off="POST">
            {{ $isFollowingUser ? 'フォロー解除' : 'フォローする' }}
        </button>
    @endif
</div>
