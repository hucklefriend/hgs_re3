@include ('admin.all_errors')
<table class="table admin-form-table" id="package-table">
    <tr>
        <th>名前</th>
        <td>
            <x-admin.input name="name" :model="$model" required maxlength="100" />
        </td>
    </tr>
    <tr>
        <th>略称</th>
        <td>
            <x-admin.input name="acronym" :model="$model" maxlength="100" />
        </td>
    </tr>
    <tr>
        <th>ノード表示用の名前</th>
        <td>
            <x-admin.textarea name="node_name" :model="$model" required maxlength="200" />
            <x-admin.node-input-support />
        </td>
    </tr>
    <tr>
        <th>メーカー</th>
        <td>
            <x-admin.select-game-maker-multi name="game_maker_ids[]" :selected="$model->makerIds()" :model="$model"  />
        </td>
    </tr>
    @if ($isAdd)
        <tr>
            <th>プラットフォーム</th>
            <td>
                <x-admin.select-game-platform-multi name="game_platform_ids[]" :selected="$model->platformIds()" :model="$model" />
            </td>
        </tr>
    @else
        <tr>
            <th>プラットフォーム</th>
            <td>
                <x-admin.select-game-platform name="game_platform_id" :model="$model" />
            </td>
        </tr>
    @endif
    <tr>
        <th>リリース日</th>
        <td>
            <x-admin.input name="release_at" :model="$model" required maxlength="100" />
        </td>
    </tr>
    <tr>
        <th>表示順</th>
        <td>
            <x-admin.input type="number" name="sort_order" :model="$model" required min="0" maxlength="99999999" />
        </td>
    </tr>
    <tr>
        <th>レーティング</th>
        <td>
            <x-admin.select-enum name="rating" :model="$model" :list="App\Enums\Rating::selectList()" />
        </td>
    </tr>
    <tr>
        <th>画像表示ショップ</th>
        <td>
            <x-admin.select name="img_shop_id" :model="$model" :list="$model->getSelectShopList()" />
        </td>
    </tr>
    <tr>
        <th>デフォルト画像</th>
        <td>
            <x-admin.select-enum name="default_img_type" :model="$model" :list="App\Enums\ProductDefaultImage::selectList()" />
        </td>
    </tr>
</table>

@section('js')

    <script>
        $(function () {
            $('#release_at').on('input', function (){
                let str = $(this).val();

                let str2 = convertDateFormat(str);
                if (str2 !== null) {
                    $('#release_at').val(str2);
                }

                let ymd = convertDateFormatToYmd(str);
                if (ymd !== null) {
                    $('#sort_order').val(ymd);
                }
            });
        });

        function convertDateFormat(str)
        {
            // 正規表現で日付フォーマットをチェック
            const datePattern = /^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/;
            const match = str.match(datePattern);

            if (match) {
                const year = match[1];
                const month = match[2];
                const day = match[3];
                return `${year}年${month}月${day}日`;
            }

            return null;
        }

        function convertDateFormatToYmd(str) {
            // 正規表現パターンを作成
            const fullDatePattern = /^(\d{4})[\/\-.年](\d{1,2})[\/\-.月](\d{1,2})[\/\-.日]?$/;
            const yearMonthPattern = /^(\d{4})[\/\-.年](\d{1,2})[\/\-.月]?$/;
            const yearPattern = /^(\d{4})[\/\-.年]?$/;

            let match;

            // 年月日がすべてある場合
            if ((match = str.match(fullDatePattern))) {
                const year = match[1];
                const month = match[2].padStart(2, '0');
                const day = match[3].padStart(2, '0');
                return `${year}${month}${day}`; // yyyymmdd形式

                // 年月のみの場合
            } else if ((match = str.match(yearMonthPattern))) {
                const year = match[1];
                const month = match[2].padStart(2, '0');
                return `${year}${month}`; // yyyymm形式

                // 年のみの場合
            } else if ((match = str.match(yearPattern))) {
                return match[1]; // yyyy形式
            }

            // フォーマットに合わない場合はnullを返す
            return null;
        }
    </script>
@endsection
