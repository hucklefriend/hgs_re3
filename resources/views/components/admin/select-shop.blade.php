<select {{ $attributes->class(['form-control', 'default-select2', 'is-invalid' => $hasError])
    ->merge(['id' => $name, 'name' => $name])->except(['list', 'forceSelect']) }}>
    @foreach ($list as $key => $val)
        @if (is_array($val))
            <optgroup label="{{ $key }}">
                @foreach ($val as $k => $v)
                    <option value="{{ $k }}" @selected(old($name, $selected) == $k)>{{ $v }}</option>
                @endforeach
            </optgroup>
        @else
            <option value="{{ $key }}" @selected(old($name, $selected) == $key)>{{ $val }}</option>
        @endif
    @endforeach
</select>
@error($name)
<div class="invalid-feedback">{{ $message }}</div>
@enderror

<script>
document.addEventListener('DOMContentLoaded', function() {
    const selectShop = document.getElementById('{{ $name }}');
    const inputUrl = document.querySelector('input[name="url"]');
    
    // URL入力欄がない場合は何もしない
    if (!inputUrl || !selectShop) {
        return;
    }
    
    // URL入力時にショップを自動選択
    inputUrl.addEventListener('input', function() {
        const url = this.value;
        
        if (!url) {
            return;
        }
        
        // URLからショップを判定
        let targetShopIds = [];
        
        // Amazon系（Amazon + Prime Video 3種類 + Amazon_SEARCH + Kindle）
        if (url.includes('amazon.co.jp') || url.includes('amzn.to')) {
            targetShopIds = [1, 51, 54, 58, 61, 101]; // Amazon, PRIME_VIDEO_SUBSCRIPTION, PRIME_VIDEO_BUY_RENTAL, PRIME_VIDEO_ALL, KINDLE, Amazon_SEARCH
        }
        // DMM系
        else if (url.includes('dmm.co.jp') || url.includes('dmm.com')) {
            targetShopIds = [2, 16, 53, 62, 71]; // DMM, DMM_GAMES, DMM_TV, DMM_BOOKS, DMM_RENTAL
        }
        // FANZA系
        else if (url.includes('fanza.co.jp')) {
            targetShopIds = [44, 45, 63, 72]; // FANZA, FANZA_GAMES, FANZA_BOOKS, FANZA_RENTAL
        }
        // 楽天系
        else if (url.includes('rakuten.co.jp') || url.includes('books.rakuten.co.jp')) {
            targetShopIds = [3, 56, 103]; // RAKUTEN_BOOKS, RAKUTEN_TV, RAKUTEN_ICHIBA_SEARCH
        }
        // 駿河屋系
        else if (url.includes('suruga-ya.jp') || url.includes('suruga-ya.com')) {
            targetShopIds = [4, 104]; // SURUGAYA, SURUGAYA_SEARCH
        }
        // Steam
        else if (url.includes('steampowered.com') || url.includes('store.steampowered.com')) {
            targetShopIds = [11]; // Steam
        }
        // PlayStation Store
        else if (url.includes('playstation.com') && url.includes('store')) {
            targetShopIds = [12]; // PlayStationStore
        }
        // Microsoft/Xbox Store
        else if (url.includes('microsoft.com') || url.includes('xbox.com')) {
            targetShopIds = [13, 18]; // MicrosoftStore, XboxStore
        }
        // Nintendo
        else if (url.includes('nintendo.co.jp') || url.includes('nintendo.com')) {
            targetShopIds = [14, 15]; // NintendoStore, NintendoEShop
        }
        // GOG
        else if (url.includes('gog.com')) {
            targetShopIds = [19]; // GOG
        }
        // Epic Games
        else if (url.includes('epicgames.com')) {
            targetShopIds = [50]; // EPIC
        }
        // App Store
        else if (url.includes('apps.apple.com')) {
            targetShopIds = [31]; // APP_STORE
        }
        // Google Play
        else if (url.includes('play.google.com')) {
            targetShopIds = [32]; // GooglePlay
        }
        // スクエニマーケット
        else if (url.includes('square-enix.com') || url.includes('sqex.to')) {
            targetShopIds = [33]; // SQM
        }
        // Getchu
        else if (url.includes('getchu.com')) {
            targetShopIds = [41]; // Getchu
        }
        // DLsite
        else if (url.includes('dlsite.com')) {
            targetShopIds = [42]; // DLsite
        }
        // Netflix
        else if (url.includes('netflix.com')) {
            targetShopIds = [52]; // NETFLIX
        }
        // Disney+
        else if (url.includes('disneyplus.com')) {
            targetShopIds = [57]; // DISNEY_PLUS
        }
        // メルカリ
        else if (url.includes('mercari.jp')) {
            targetShopIds = [102]; // MERCARI_SEARCH
        }
        // EGG
        else if (url.includes('amusement-center.com') || url.includes('project-egg.com')) {
            targetShopIds = [17]; // EGG
        }
        
        // 対象ショップがない場合は何もしない
        if (targetShopIds.length === 0) {
            return;
        }
        
        // selectの選択肢から対象ショップを探す（最初に見つかったものを選択）
        const options = selectShop.querySelectorAll('option');
        for (const option of options) {
            const value = parseInt(option.value);
            if (targetShopIds.includes(value)) {
                // 見つかった場合、そのショップを選択
                $(selectShop).val(value).trigger('change');
                break;
            }
        }
    });
});
</script>

