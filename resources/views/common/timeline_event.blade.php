<section class="node basic">
    <div class="node-head">
        <span class="node-head-text">
            @if ($event['type'] === 'review_posted')
                <i class="bi bi-file-text text-sky-400"></i> {{ $event['actor_name'] }} さんがレビューを投稿しました
            @elseif ($event['type'] === 'review_updated')
                <i class="bi bi-file-text text-sky-400"></i> {{ $event['actor_name'] }} さんがレビューを更新しました
            @elseif ($event['type'] === 'fear_meter_posted')
                <i class="bi bi-thermometer-half text-orange-400"></i> {{ $event['actor_name'] }} さんが怖さメーターを投稿しました
            @elseif ($event['type'] === 'fear_meter_updated')
                <i class="bi bi-thermometer-half text-orange-400"></i> {{ $event['actor_name'] }} さんが怖さメーターを更新しました
            @elseif ($event['type'] === 'game_title_updated')
                <i class="bi bi-arrow-clockwise text-emerald-400"></i> {{ $event['game_title_name'] }} のデータが更新されました
            @elseif ($event['type'] === 'review_liked')
                <i class="bi bi-hand-thumbs-up-fill text-blue-400"></i> {{ $event['actor_name'] }} さんがレビューにいいねしてくれました
            @elseif ($event['type'] === 'information_posted')
                <i class="bi bi-megaphone text-yellow-400"></i> お知らせが投稿されました
            @endif
        </span>
        <span class="node-pt">●</span>
    </div>
    <div class="node-content basic text-sm">
        @if (in_array($event['type'], ['review_posted', 'review_updated']))
            <div class="flex items-baseline gap-4">
                <span class="text-slate-300">{{ $event['game_title_name'] }}</span>
                @if ($event['total_score'] !== null)
                    <span class="flex items-baseline gap-1">
                        <span class="text-2xl font-bold text-slate-100 leading-none">{{ $event['total_score'] }}</span>
                        <span class="text-xs text-slate-100">/ 100</span>
                    </span>
                @endif
            </div>
        @elseif (in_array($event['type'], ['fear_meter_posted', 'fear_meter_updated']))
            <p class="text-slate-300">{{ $event['game_title_name'] }} <span class="text-base text-slate-100">{{ $event['fear_meter_label'] }}</span></p>
        @elseif ($event['type'] === 'review_liked')
            <p class="text-slate-300">{{ $event['game_title_name'] }}</p>
        @elseif ($event['type'] === 'information_posted')
            <p class="text-slate-300">{{ $event['information_head'] }}</p>
        @endif
        @if ($event['note'])
            <p class="text-slate-300 mt-1">{!! nl2br(e($event['note'])) !!}</p>
        @endif
        <p class="text-xs text-slate-500 mt-1">{{ $event['created_at']->format('Y-m-d H:i') }}</p>
        <div class="mt-2 text-xs">
            @if (in_array($event['type'], ['review_posted', 'review_updated', 'review_liked']) && $event['game_title_key'] && $event['review_key'])
                <a href="{{ route('Game.TitleReview', ['titleKey' => $event['game_title_key'], 'reviewKey' => $event['review_key']]) }}" data-hgn-scope="full"><i class="bi bi-file-text"></i> レビュー詳細</a>
            @elseif (in_array($event['type'], ['game_title_updated', 'fear_meter_posted', 'fear_meter_updated']) && $event['game_title_key'])
                <a href="{{ route('Game.TitleDetail', ['titleKey' => $event['game_title_key']]) }}" data-hgn-scope="full"><i class="bi bi-controller"></i> タイトル詳細</a>
            @elseif ($event['type'] === 'information_posted' && $event['information_id'])
                <a href="{{ route('InformationDetail', ['info' => $event['information_id']]) }}" data-hgn-scope="full"><i class="bi bi-megaphone"></i> お知らせ詳細</a>
            @endif
        </div>
    </div>
</section>
