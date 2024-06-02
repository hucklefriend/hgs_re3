<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Admin\AbstractAdminController;

abstract class AbstractMasterDataController extends AbstractAdminController
{
    protected string $masterName = '';

    protected function makeSearchSessionKey(): string
    {
        return 'search_' . $this->masterName;
    }
}
