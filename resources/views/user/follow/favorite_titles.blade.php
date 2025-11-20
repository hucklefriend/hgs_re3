@extends('layout')

@section('title', 'お気に入りタイトル')
@section('current-node-title', 'お気に入りタイトル')

@section('current-node-content')

@if ($favoriteTitles->isEmpty())
    <p>お気に入りに登録されているタイトルはありません。</p>
@else
    <p>お気に入りに登録されているタイトル一覧です。</p>
@endif

@endsection

@section('nodes')
    @if ($favoriteTitles->isNotEmpty())
        <section class="node tree-node" id="favorite-titles-tree-node">
            <div class="node-head">
                <h2 class="node-head-text">お気に入りタイトル</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @foreach ($favoriteTitles as $title)
                <section class="node link-node" id="favorite-title-{{ $title->id }}-link-node">
                    <div class="node-head">
                        <span class="favorite-indicator" data-game-title-id="{{ $title->id }}" data-processing="false" onclick="toggleFavorite(this)" style="cursor: pointer; color: yellow; font-size: 20px; margin-left: 10px;">★</span>
                        <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" class="node-head-text">{{ $title->name }}</a>
                        <span class="node-pt">●</span>
                    </div>
                </section>
                @endforeach
            </div>
            <script>
            // 既存の関数を上書きしてメモリリークを防ぐ
            window.toggleFavorite = async function(element) {
                if (element.getAttribute('data-processing') === 'true') return;

                element.setAttribute('data-processing', 'true');
                const gameTitleId = element.getAttribute('data-game-title-id');
                const apiUrl = '{{ route("api.user.favorite.toggle") }}';
                const currentText = element.textContent.trim();
                const isCurrentlyFavorite = currentText === '★';
                
                // 即座に表示を切り替え
                element.textContent = isCurrentlyFavorite ? '☆' : '★';

                try {
                    const headers = {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    };
                    
                    // CSRFトークンを追加
                    if (window.Laravel && window.Laravel.csrfToken) {
                        headers['X-CSRF-TOKEN'] = window.Laravel.csrfToken;
                    }
                    
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: headers,
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            game_title_id: parseInt(gameTitleId)
                        })
                    });

                    if (!response.ok) {
                        throw new Error('API request failed');
                    }

                    // CSRFトークンを更新（レスポンスヘッダーから取得）
                    const newCsrfToken = response.headers.get('X-CSRF-TOKEN');
                    if (newCsrfToken && window.Laravel) {
                        window.Laravel.csrfToken = newCsrfToken;
                    }

                    const data = await response.json();
                    
                    // レスポンスのステータスに応じて表示を確定
                    if (data.status === 1) {
                        // 登録された
                        element.textContent = '★';
                    } else if (data.status === 2) {
                        // 解除された
                        element.textContent = '☆';
                    } else {
                        // 予期しないステータスの場合は元に戻す
                        element.textContent = currentText;
                        throw new Error('Unexpected status');
                    }
                } catch (error) {
                    // エラー時は元の表示に戻す
                    element.textContent = currentText;
                    alert('お気に入りの登録・解除に失敗しました。');
                } finally {
                    element.setAttribute('data-processing', 'false');
                }
            };
            </script>
        </section>
    @endif

    @include('common.shortcut')
@endsection

