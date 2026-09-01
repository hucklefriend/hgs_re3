<footer class="site-footer">
    <div class="site-frame">
        <div class="site-footer__grid">
            <span class="site-footer__terminal" aria-hidden="true"></span>
            <p>TERMINAL</p>
            <nav class="site-footer__nav" aria-label="サイト情報">
                <a href="{{ route('Root') }}" class="has-site-connection-terminal"><span class="site-connection-label site-connection-label--mono">ルート / ROOT<x-site.connection-terminal /></span></a>
                <a href="{{ route('About') }}" class="has-site-connection-terminal"><span class="site-connection-label site-connection-label--mono">このサイトについて / ABOUT<x-site.connection-terminal /></span></a>
                <a href="{{ route('PrivacyPolicy') }}" class="has-site-connection-terminal"><span class="site-connection-label site-connection-label--mono">プライバシーポリシー / PRIVACY POLICY<x-site.connection-terminal /></span></a>
                <a href="{{ route('Contact') }}" class="has-site-connection-terminal"><span class="site-connection-label site-connection-label--mono">問い合わせ / CONTACT<x-site.connection-terminal /></span></a>
            </nav>
            <p class="site-footer__copyright">&copy; 2003-{{ date('Y') }} <a href="https://junkonkai.com" target="_blank" rel="external noopener">電子創作房 純魂会</a></p>
        </div>
    </div>
</footer>
