<?php

namespace App\Http\Controllers\Admin\Manage;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Manage\InformationRequest;
use App\Models\Information;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Carbon\Carbon;

class InformationController extends AbstractAdminController
{
    /**
     * リスト
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.manage.information.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
    {
        $information = Information::orderByDesc('open_at');
        $searchDateTime = trim($request->query('datetime', ''));
        $search = ['datetime' => ''];

        if (!empty($searchDateTime)) {
            $search['datetime'] = $searchDateTime;

            $information->where('open_at', '<=', $searchDateTime);
            $information->where('close_at', '>=', $searchDateTime);
        }

        $this->saveSearchSession($search);

        return [
            'search'      => $search,
            'information' => $information->paginate(AdminDefine::ITEMS_PER_PAGE)
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $info = new Information();
        $info->open_at = now()->format('Y-m-d\TH:i');
        $info->close_at = '2099-12-31T23:59';

        return view('admin.manage.information.add', [
            'model' => $info,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InformationRequest $request)
    {
        $validated = $this->applyNoEndCloseAt($request->validated());
        $info = new Information();
        $info->fill($this->normalizeInformationDatetimes($validated));
        $info->save();

        return redirect()->route('Admin.Manage.Information.Show', $info);
    }

    /**
     * Display the specified resource.
     */
    public function show(Information $information)
    {
        return view('admin.manage.information.detail', [
            'model' => $information
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Information $information)
    {
        return view('admin.manage.information.edit', [
            'model' => $information
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(InformationRequest $request, Information $information)
    {
        $validated = $this->applyNoEndCloseAt($request->validated());
        $information->fill($this->normalizeInformationDatetimes($validated));
        $information->save();

        return redirect()->route('Admin.Manage.Information.Show', $information);
    }

    /**
     * 「終了なし」チェック時はclose_atを2099-12-31 23:59:59にする
     *
     * @param array $validated
     * @return array
     */
    private function applyNoEndCloseAt(array $validated): array
    {
        if (!empty($validated['no_end'])) {
            $validated['close_at'] = '2099-12-31T23:59';
        }

        return $validated;
    }

    /**
     * 日時を正規化する（DB保存用）
     * open_atは秒00、close_atは秒59で登録する
     *
     * @param array $validated
     * @return array
     */
    private function normalizeInformationDatetimes(array $validated): array
    {
        if (!empty($validated['open_at'])) {
            $validated['open_at'] = Carbon::parse($validated['open_at'])->format('Y-m-d H:i:00');
        }
        if (!empty($validated['close_at'])) {
            $validated['close_at'] = Carbon::parse($validated['close_at'])->format('Y-m-d H:i:59');
        }

        return $validated;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Information $information)
    {
        $information->delete();

        return redirect()->route('Admin.Manage.Information');
    }
}
