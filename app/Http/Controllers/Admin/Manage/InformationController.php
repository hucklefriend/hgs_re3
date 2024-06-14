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
        return view('admin.manage.information.add', [
            'model' => new Information(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InformationRequest $request)
    {
        $info = new Information();
        $info->fill($request->validated());
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
        $information->fill($request->validated());
        $information->save();

        return redirect()->route('Admin.Manage.Information.Show', $information);
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
