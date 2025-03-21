import ComponentBase from './component-base.js';

export default class HorrorGameSearch extends ComponentBase
{
    constructor()
    {
        super();

        this._form = document.querySelector('#search-form');
        this._input = document.querySelector('#search-input');
        this._input.addEventListener('input', this.search.bind(this));
        this._inputWaitTimer = null;

        // 検索結果表示用の要素を作成
        this._suggestionsContainer = document.createElement('div');
        this._suggestionsContainer.className = 'search-suggestions';
        this._form.appendChild(this._suggestionsContainer);

        // クリックイベントの委譲
        this._suggestionsContainer.addEventListener('click', (e) => {
            const item = e.target.closest('.suggestion-item');
            if (item) {
                const name = item.dataset.name;
                const type = item.dataset.type;
                this.selectItem(name, type);
            }
        });

        // 入力フィールドのフォーカスイベント
        this._input.addEventListener('focus', () => {
            if (this._suggestionsContainer.children.length > 0) {
                this._suggestionsContainer.style.display = 'block';
            }
        });

        // ドキュメントクリックでサジェストを非表示
        document.addEventListener('click', (e) => {
            if (!this._form.contains(e.target)) {
                this._suggestionsContainer.style.display = 'none';
            }
        });
    }

    search()
    {
        clearTimeout(this._inputWaitTimer);

        this._inputWaitTimer = setTimeout(() => {
            const text = this._input.value;
            if (text.length === 0) {
                return;
            }

            const params = new URLSearchParams();
            params.append('text', text);

            fetch(`${this._form.action}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            }).then((response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        callback(error, true);
                        throw new Error('Fetch error');
                    });
                }
                return response.json(); // JSON形式のレスポンスを取得
            }).then((data) => {
                // データの取得が成功した場合の処理
                this.showList(data);
            }).catch((error) => {
                console.error(error);
            });
        }, 300);
    }

    showList(data)
    {
        // data.franchisesにtypeを追加
        data.franchises.forEach(franchise => {
            franchise.type = 'franchise';
        });

        // data.titlesにtypeを追加
        data.titles.forEach(title => {
            title.type = 'title';
        });
        
        // data.franchisesとdata.titlesを結合
        const list = [...data.franchises, ...data.titles];

        // nameをもとにソート
        list.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        // 検索結果を表示
        this._suggestionsContainer.innerHTML = '';
        
        if (list.length === 0) {
            this._suggestionsContainer.style.display = 'none';
            return;
        }

        list.forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.dataset.name = item.name;
            div.dataset.type = item.type;
            
            const icon = document.createElement('span');
            icon.className = 'suggestion-icon';
            icon.textContent = item.type === 'franchise' ? 'フランチャイズ' : 'タイトル';
            
            const name = document.createElement('span');
            name.className = 'suggestion-name';
            name.textContent = item.name;
            
            div.appendChild(icon);
            div.appendChild(name);
            this._suggestionsContainer.appendChild(div);
        });

        this._suggestionsContainer.style.display = 'block';
    }

    selectItem(name, type)
    {
        this._input.value = name;
        this._suggestionsContainer.style.display = 'none';
        
        // 選択された項目の情報を親コンポーネントに通知
        this.dispatchEvent(new CustomEvent('itemSelected', {
            detail: { name, type }
        }));
    }
}
