<section class="node tree-node">
    <div class="node-head">
        <h2 class="node-head-text">近道</h2>
        <span class="node-pt">●</span>
    </div>
    <div class="node-content tree">
        @isset($shortcutRoute)
            @include('common.shortcut_node', ['nodes' => $shortcutRoute])
        @else
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Root') }}" class="node-head-text">トップ</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
            </section>
        @endisset

        @if (Auth::check())
        <section class="node link-node">
            <div class="node-head">
                <a href="{{ route('User.MyNode.Top') }}" class="node-head-text">マイページ</a>
                <span class="node-pt">●</span>
            </div>
        </section>
        @else
        <section class="node link-node">
            <div class="node-head">
                <a href="{{ route('Account.Login') }}" class="node-head-text">ログイン</a>
                <span class="node-pt">●</span>
            </div>
        </section>
        <section class="node link-node">
            <div class="node-head">
                <a href="{{ route('Account.Register') }}" class="node-head-text">アカウント新規登録</a>
                <span class="node-pt">●</span>
            </div>
        </section>
        @endif
    </div>
</section>
