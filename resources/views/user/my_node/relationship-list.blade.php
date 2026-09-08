    @if ($users->isNotEmpty())
        <section class="lineup-franchise following-user-list" id="{{ $listKind }}-list-node">
            <header>
                <div><p>USER NODE</p><h2>ユーザーリスト</h2></div>
            </header>
            <div class="following-user-list__entries">
                @foreach ($users as $u)
                    @php
                        $isMutingUser = $listKind === 'muting';
                        if ($listKind === 'following') {
                            $isMutingUser = $mutedUserIds->has($u->id);
                        }
                        $actionMenuId = $listKind . '-user-actions-' . $u->id;
                    @endphp
                    <div class="following-user-entry">
                        @if ($listKind === 'blocking')
                            <div class="following-user-link">
                        @else
                        <a href="{{ route('User.Profile.Show', $u->show_id) }}"
                           class="following-user-link">
                        @endif
                            <x-user-avatar :user="$u" class="following-user-link__avatar"/>
                            <span class="following-user-link__identity">
                                <strong class="following-user-link__name">{{ $u->name }}</strong>
                                <span class="following-user-link__id">{{ '@' . $u->show_id }}</span>
                            </span>
                        @if ($listKind === 'blocking')
                            </div>
                        @else
                            <x-site.connection-terminal />
                        </a>
                        @endif
                        <div class="following-user-action-menu js-user-action-menu">
                            <button type="button"
                                    class="following-user-action-menu__trigger has-site-connection-terminal"
                                    aria-label="{{ $u->name }}の操作メニュー"
                                    aria-haspopup="menu"
                                    aria-expanded="false"
                                    aria-controls="{{ $actionMenuId }}">
                                <span>操作</span>
                                <span class="following-user-action-menu__trigger-mark" aria-hidden="true">+</span>
                                <x-site.connection-terminal />
                            </button>
                            <div class="following-user-action-menu__panel"
                                 id="{{ $actionMenuId }}"
                                 role="menu"
                                 hidden>
                                @if ($listKind !== 'blocking')
                                <a href="{{ route('User.Profile.Show', $u->show_id) }}"
                                   class="following-user-action-menu__item"
                                   data-no-connection-terminal
                                   role="menuitem">
                                    プロフィールを見る
                                </a>
                                @endif
                                @if ($listKind === 'following' || $listKind === 'muting')
                                <form method="POST" action="{{ route($muteRoute, $u->show_id) }}">
                                    @csrf
                                    @if ($isMutingUser)
                                        @method('DELETE')
                                    @endif
                                    <button type="submit"
                                            class="following-user-action-menu__item"
                                            role="menuitem">
                                        {{ $isMutingUser ? 'ミュートを解除' : 'ミュートする' }}
                                    </button>
                                </form>
                                @endif
                                @if ($listKind !== 'blocking' && $listKind !== 'muting')
                                <div class="following-user-action-menu__separator" role="separator"></div>
                                @endif
                                @if ($listKind === 'following')
                                <button type="button"
                                        class="js-follow-toggle following-user-action-menu__item following-user-action-menu__item--warning"
                                        role="menuitem"
                                        data-show-id="{{ $u->show_id }}"
                                        data-active="1"
                                        data-label-on="フォローを解除"
                                        data-label-off="フォローする"
                                        data-url-on="{{ route('api.users.unfollow', $u->show_id) }}"
                                        data-url-off="{{ route('api.users.follow', $u->show_id) }}"
                                        data-method-on="DELETE"
                                        data-method-off="POST"
                                        data-reload="1">
                                    フォローを解除
                                </button>
                                @endif
                                @if ($listKind !== 'muting')
                                <button type="button"
                                        class="js-block-toggle following-user-action-menu__item following-user-action-menu__item--danger"
                                        role="menuitem"
                                        data-show-id="{{ $u->show_id }}"
                                        data-active="{{ $listKind === 'blocking' ? '1' : '0' }}"
                                        data-label-on="ブロックを解除"
                                        data-label-off="ブロックする"
                                        data-url-on="{{ route('api.users.unblock', $u->show_id) }}"
                                        data-url-off="{{ route('api.users.block', $u->show_id) }}"
                                        data-method-on="DELETE"
                                        data-method-off="POST"
                                        @if ($listKind !== 'blocking')
                                        data-confirm="このユーザーをブロックしますか？ お互いのフォローも解除されます。"
                                        @endif
                                        data-reload="1">
                                    {{ $listKind === 'blocking' ? 'ブロックを解除' : 'ブロックする' }}
                                </button>
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            <div class="following-user-list__pager">
                @include('common.pager', ['pager' => $pager])
            </div>
        </section>
    @endif

