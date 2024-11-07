<?php

namespace App\Models\Extensions;

use App\Models\OgpCache;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Log;

trait OgpTrait
{
    /**
     * OGP情報をセット
     *
     * @param ?string $url
     * @return self
     */
    public function setOgpInfo(?string $url): self
    {
        $this->ogp_cache_id = null; // 一旦リセットしとく

        if (empty($url)) {
            Log::debug("Ogp: url is empty");
            return $this;
        }

        $this->ogp_cache_id = null;

        if (!empty($url)) {
            $ogpCache = OgpCache::findOrNewByUrl($url);
            $ogpCache->fetch();
            $ogpCache->saveOrDelete();
            if ($ogpCache->id !== null) {
                $this->ogp_cache_id = $ogpCache->id;
            }
        }

        return $this;
    }

    /**
     * OGP情報を取得
     *
     * @return ?HasOne
     */
    public function ogp(): ?HasOne
    {
        return $this->hasOne(OgpCache::class, 'id', 'ogp_cache_id');
    }
}
