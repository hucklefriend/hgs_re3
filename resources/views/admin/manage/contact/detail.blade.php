@extends('admin.layout')

@section('content')
    @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show">
            <strong>成功!</strong> {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    @if (session('error'))
        <div class="alert alert-danger alert-dismissible fade show">
            <strong>エラー!</strong> {{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">お問い合わせ詳細 #{{ $model->id }}</h4>
        </div>
        <div class="panel-body">
            <table class="table admin-form-table">
                <tr>
                    <th width="200">ID</th>
                    <td>{{ $model->id }}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>
                        @php
                            $statusColors = [
                                0 => 'warning',  // 未対応
                                1 => 'primary',  // 対応中
                                2 => 'success',  // 完了
                                3 => 'secondary', // クローズ
                                4 => 'danger'    // 取り消し
                            ];
                            $color = $statusColors[$model->status->value] ?? 'secondary';
                        @endphp
                        <span class="badge bg-{{ $color }} fs-6">{{ $model->status->label() }}</span>
                    </td>
                </tr>
                <tr>
                    <th>Token</th>
                    <td>
                        <code>{{ $model->token }}</code>
                        <a href="{{ route('Contact.Show', ['token' => $model->token]) }}" target="_blank" class="btn btn-sm btn-info ms-2">
                            <i class="fas fa-external-link-alt"></i> ユーザー画面で見る
                        </a>
                    </td>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>{{ $model->name }}</td>
                </tr>
                <tr>
                    <th>Category</th>
                    <td>{{ $model->category ?? '-' }}</td>
                </tr>
                <tr>
                    <th>Subject</th>
                    <td>{{ $model->subject ?? '-' }}</td>
                </tr>
                <tr>
                    <th>Message</th>
                    <td style="white-space: pre-wrap;">{{ $model->message }}</td>
                </tr>
                <tr>
                    <th>IP Address</th>
                    <td>{{ $model->ip_address ?? '-' }}</td>
                </tr>
                <tr>
                    <th>User Agent</th>
                    <td style="word-break: break-all;">{{ $model->user_agent ?? '-' }}</td>
                </tr>
                <tr>
                    <th>User ID</th>
                    <td>{{ $model->user_id ?? '-' }}</td>
                </tr>
                <tr>
                    <th>Admin Notes</th>
                    <td style="white-space: pre-wrap;">{{ $model->admin_notes ?? '-' }}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{{ $model->created_at->format('Y-m-d H:i:s') }}</td>
                </tr>
                <tr>
                    <th>Updated At</th>
                    <td>{{ $model->updated_at->format('Y-m-d H:i:s') }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">ステータス変更</h4>
        </div>
        <div class="panel-body">
            <form method="POST" action="{{ route('Admin.Manage.Contact.UpdateStatus', $model) }}" class="row align-items-end">
                @csrf
                <div class="col-md-6">
                    <label for="status" class="form-label">ステータス</label>
                    <select name="status" id="status" class="form-select" required>
                        @foreach(\App\Enums\ContactStatus::cases() as $status)
                            <option value="{{ $status->value }}" {{ $model->status->value === $status->value ? 'selected' : '' }}>
                                {{ $status->label() }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-6">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-sync-alt"></i> ステータスを更新
                    </button>
                </div>
            </form>
            <div class="alert alert-info mt-3 mb-0">
                <strong>💡 ステータスについて</strong>
                <ul class="mb-0 mt-2">
                    <li><strong>未対応</strong>: まだ対応していない状態</li>
                    <li><strong>対応中</strong>: 管理者が最初に返信すると自動的に変更されます</li>
                    <li><strong>完了</strong>: 対応が完了した状態。ユーザーに「2週間後に自動クローズ」の警告が表示されます</li>
                    <li><strong>クローズ</strong>: 問い合わせを閉じた状態</li>
                    <li><strong>取り消し</strong>: ユーザーが取り消した状態</li>
                </ul>
            </div>
        </div>
    </div>

    @if($responses->count() > 0)
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">返信履歴 ({{ $responses->count() }}件)</h4>
            </div>
            <div class="panel-body">
                @foreach($responses as $response)
                    <div class="card mb-3 border-start border-4 border-{{ $response->responder_type->value === 0 ? 'success' : 'primary' }}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <strong class="text-{{ $response->responder_type->value === 0 ? 'success' : 'primary' }}">
                                        @if($response->responder_type->value === 0)
                                            👤 {{ $response->responder_name ?? '管理者' }}
                                        @elseif($response->responder_type->value === 1)
                                            💬 {{ $response->responder_name ?? 'ユーザー' }}
                                        @else
                                            🤖 システム
                                        @endif
                                    </strong>
                                    <span class="badge bg-{{ $response->responder_type->value === 0 ? 'success' : 'primary' }} ms-2">
                                        {{ $response->responder_type->label() }}
                                    </span>
                                    @if($response->user_id)
                                        <span class="text-muted ms-2">(User ID: {{ $response->user_id }})</span>
                                    @endif
                                </div>
                                <small class="text-muted">{{ $response->created_at->format('Y-m-d H:i:s') }}</small>
                            </div>
                            <div style="white-space: pre-wrap;">{{ $response->message }}</div>
                            @if($response->ip_address)
                                <div class="mt-2 text-muted small">
                                    IP: {{ $response->ip_address }}
                                </div>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    @else
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">返信履歴</h4>
            </div>
            <div class="panel-body">
                <div class="alert alert-info text-center">
                    まだ返信がありません。
                </div>
            </div>
        </div>
    @endif

    @if($model->status->value !== 4)
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">管理者返信を投稿</h4>
            </div>
            <div class="panel-body">
                <div class="alert alert-info">
                    <strong>💡 個人情報保護機能について</strong>
                    <p class="mb-0 mt-2">
                        <code>/*</code>と<code>*/</code>で囲んだ個人情報は、ユーザー確認画面では<strong>■で伏せ字</strong>として表示されます（同じ文字数分）。<br>
                        <strong>例：</strong> 返信は /*admin@example.com*/ までお願いします。 → ユーザーには「返信は ■■■■■■■■■■■■■■■■■■■ までお願いします。」と表示
                    </p>
                </div>

                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul class="mb-0">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST" action="{{ route('Admin.Manage.Contact.StoreResponse', $model) }}">
                    @csrf

                    <div class="mb-3">
                        <label for="responder_name" class="form-label">返信者名（任意）</label>
                        <input 
                            type="text" 
                            id="responder_name" 
                            name="responder_name" 
                            value="{{ old('responder_name', '管理者') }}" 
                            class="form-control"
                            placeholder="管理者"
                        >
                        <small class="form-text text-muted">※ 空欄の場合は「管理者」として表示されます。</small>
                    </div>

                    <div class="mb-3">
                        <label for="message" class="form-label">返信内容 <span class="text-danger">*</span></label>
                        <textarea 
                            id="message" 
                            name="message" 
                            rows="10" 
                            required
                            class="form-control"
                            placeholder="返信内容を入力してください"
                        >{{ old('message') }}</textarea>
                    </div>

                    <div class="text-end">
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-paper-plane"></i> 返信を投稿
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @else
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">管理者返信を投稿</h4>
            </div>
            <div class="panel-body">
                <div class="alert alert-warning text-center">
                    <i class="fas fa-exclamation-triangle"></i> この問い合わせは取り消されているため、返信できません。
                </div>
            </div>
        </div>
    @endif

    <div class="text-center mt-3">
        <a href="{{ route('Admin.Manage.Contact') }}" class="btn btn-default">
            <i class="fas fa-arrow-left"></i> 一覧に戻る
        </a>
    </div>
@endsection

