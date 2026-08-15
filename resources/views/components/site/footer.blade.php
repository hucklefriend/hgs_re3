<footer class="site-footer">
    <div class="site-frame">
        <div class="site-footer__grid">
            <span class="site-footer__terminal" aria-hidden="true"></span>
            <p>TERMINAL</p>
            <nav class="site-footer__nav" aria-label="サイト情報">
                <a href="{{ route('Root') }}">ルート / ROOT</a>
                <a href="{{ route('About') }}">このサイトについて / ABOUT</a>
                <a href="{{ route('PrivacyPolicy') }}">プライバシーポリシー / PRIVACY POLICY</a>
                <a href="{{ route('Contact') }}">問い合わせ / CONTACT</a>
            </nav>
            <p class="site-footer__copyright">&copy; 2003-{{ date('Y') }} <a href="https://junkonkai.com" target="_blank" rel="external noopener">電子創作房 純魂会</a></p>
        </div>
    </div>
</footer>
