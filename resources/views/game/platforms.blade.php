@extends('layout')

@section('title', 'プラットフォーム')
@section('body-class', 'site-page--lineup')
@section('current-node-title', 'プラットフォーム')

@section('nodes')
    <section class="lineup-results" aria-label="プラットフォーム一覧">
        <div class="lineup-results__frame">
            <div class="lineup-result-list">
                @if ($platforms->isEmpty())
                    <p class="site-empty-state">登録されているプラットフォームはありません。</p>
                @else
                    @foreach (\App\Enums\GamePlatformType::cases() as $type)
                        @php($platformsOfType = $platforms->where('type', $type))
                        @continue($platformsOfType->isEmpty())

                        <section class="lineup-franchise">
                            <header>
                                <div>
                                    <p>PLATFORM TYPE</p>
                                    <h2>{{ $type->text() }}</h2>
                                </div>
                            </header>
                            <div class="lineup-franchise__entries">
                                @foreach ($platformsOfType as $platform)
                                    <a href="{{ route('Game.PlatformDetail', ['platformKey' => $platform->key]) }}" id="{{ $platform->key }}-link-node">
                                        <span class="lineup-result-signal" aria-hidden="true"></span>
                                        <b>{{ $platform->name }}</b>
                                    </a>
                                @endforeach
                            </div>
                        </section>
                    @endforeach
                @endif
            </div>
        </div>
    </section>
@endsection
