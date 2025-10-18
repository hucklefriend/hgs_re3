<?php

namespace App\Http\Controllers\Admin\Manage;

use App\Defines\AdminDefine;
use App\Enums\ContactResponderType;
use App\Enums\ContactStatus;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Manage\ContactResponseRequest;
use App\Models\Contact;
use App\Models\ContactResponse;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactController extends AbstractAdminController
{
    /**
     * お問い合わせ一覧
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.manage.contact.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
    {
        $query = Contact::with('responses')->orderByDesc('created_at');
        
        $searchStatus = $request->query('status', '');
        $searchKeyword = trim($request->query('keyword', ''));
        
        $search = [
            'status' => $searchStatus,
            'keyword' => $searchKeyword,
        ];

        // ステータスで絞り込み
        if ($searchStatus !== '') {
            $query->where('status', intval($searchStatus));
        }

        // キーワード検索（名前、メッセージ）
        if (!empty($searchKeyword)) {
            $query->where(function ($q) use ($searchKeyword) {
                $q->where('name', 'like', '%' . $searchKeyword . '%')
                    ->orWhere('message', 'like', '%' . $searchKeyword . '%');
            });
        }

        $this->saveSearchSession($search);

        return [
            'search' => $search,
            'contacts' => $query->paginate(AdminDefine::ITEMS_PER_PAGE),
            'statuses' => ContactStatus::cases(),
        ];
    }

    /**
     * お問い合わせ詳細
     *
     * @param Contact $contact
     * @return Application|Factory|View
     */
    public function show(Contact $contact): Application|Factory|View
    {
        // レスポンスを取得
        $responses = $contact->responses()->orderBy('created_at', 'asc')->get();

        return view('admin.manage.contact.detail', [
            'model' => $contact,
            'responses' => $responses,
        ]);
    }

    /**
     * 管理者返信投稿処理
     *
     * @param Contact $contact
     * @param ContactResponseRequest $request
     * @return RedirectResponse
     */
    public function storeResponse(Contact $contact, ContactResponseRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // 管理者からの返信がまだない場合（最初の返信）
        $hasAdminResponse = $contact->responses()
            ->where('responder_type', ContactResponderType::ADMIN->value)
            ->exists();

        // 管理者からの返信を保存
        ContactResponse::create([
            'contact_id' => $contact->id,
            'message' => $validated['message'],
            'responder_type' => ContactResponderType::ADMIN,
            'user_id' => Auth::guard('admin')->id(),
            'responder_name' => $validated['responder_name'] ?? '管理者',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // 最初の管理者返信かつステータスがPENDINGの場合、IN_PROGRESSに変更
        if (!$hasAdminResponse && $contact->status === ContactStatus::PENDING) {
            $contact->update(['status' => ContactStatus::IN_PROGRESS]);
        }

        return redirect()->route('Admin.Manage.Contact.Show', $contact)
            ->with('success', '返信を投稿しました。');
    }

    /**
     * ステータス更新処理
     *
     * @param Contact $contact
     * @param Request $request
     * @return RedirectResponse
     */
    public function updateStatus(Contact $contact, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|integer|min:0|max:4',
        ]);

        $newStatus = ContactStatus::from($validated['status']);

        // ステータスをRESOLVED（完了）に変更する場合、resolved_atを記録
        $updateData = ['status' => $newStatus];
        if ($newStatus === ContactStatus::RESOLVED && $contact->status !== ContactStatus::RESOLVED) {
            $updateData['resolved_at'] = now();
        }

        $contact->update($updateData);

        return redirect()->route('Admin.Manage.Contact.Show', $contact)
            ->with('success', 'ステータスを「' . $newStatus->label() . '」に変更しました。');
    }
}

