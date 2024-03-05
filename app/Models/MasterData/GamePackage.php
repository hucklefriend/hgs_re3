<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class GamePackage extends Model
{
    protected $guarded = ['id'];

    /**
     * メーカーを取得
     *
     * @return BelongsTo
     */
    public function maker(): BelongsTo
    {
        return $this->belongsTo(GameMaker::class, 'maker_id');
    }

    /**
     * プラットフォームを取得
     *
     * @return BelongsTo
     */
    public function platform(): BelongsTo
    {
        return $this->belongsTo(GamePlatform::class, 'platform_id');
    }

    /**
     * ソフトを取得
     *
     * @return BelongsToMany
     */
    public function softs(): BelongsToMany
    {
        return $this->belongsToMany(GameTitle::class);
    }

    /**
     * ショップを取得
     *
     * @return Collection
     */
    public function shops(): Collection
    {
        return GamePackageShop::where('package_id', $this->id)->get();
    }

    /**
     * ショップを取得
     * (なぜかこれで動かない)
     *
     * @return HasMany
     */
//    public function shops(): HasMany
//    {
//        return $this->hasMany(GamePackageShop::class, 'package_id', 'id');
//    }

    /**
     * 保存
     *
     * @param array $options
     * @return bool
     */
    public function save(array $options = []): bool
    {
        /* @var $soft GameTitle */
        foreach ($this->softs as $soft) {
            if ($soft->original_package_id === null) {
                $soft->setOriginalPackage();
                $soft->save();
            }
        }

        return parent::save($options);
    }

    /**
     * データのハッシュを取得
     *
     * @param array $packageIds
     * @return array
     */
    public static function getHash(array $packageIds): array
    {
        if (empty($packageIds)) {
            return [];
        }

        $data = self::whereIn('id', $packageIds)
            ->get();

        $hash = [];
        foreach ($data as $row) {
            $hash[$row->id] = $row;
        }

        unset($data);

        return $hash;
    }

    /**
     * Amazonから取得できた情報を元に、画像情報をセット
     *
     * @param array $item
     */
    public function setImageByAmazon(array $item)
    {
        if (isset($item['small_image'])) {
            $this->small_image_url     = $item['small_image']['url'] ?? null;
            $this->small_image_width   = $item['small_image']['width'] ?? null;
            $this->small_image_height  = $item['small_image']['height'] ?? null;
        }

        if (isset($item['medium_image'])) {
            $this->medium_image_url = $item['medium_image']['url'] ?? null;
            $this->medium_image_width = $item['medium_image']['width'] ?? null;
            $this->medium_image_height = $item['medium_image']['height'] ?? null;
        }

        if (isset($item['large_image'])) {
            $this->large_image_url = $item['large_image']['url'] ?? null;
            $this->large_image_width = $item['large_image']['width'] ?? null;
            $this->large_image_height = $item['large_image']['height'] ?? null;
        }
    }

    /**
     * ショップ情報をセット
     */
    public function setShop()
    {
        $shops = GamePackageShop::where('package_id', $this->id)
            ->get();

        foreach ($shops as $shop) {
            switch ($shop->shop_id) {
                case Shop::AMAZON:
                    $this->asin = $shop->param1;
                    break;
            }
        }
    }

    /**
     * 削除
     *
     * @return bool|null
     */
    public function delete(): bool|null
    {
        /* @var GamePackageShop $shop */
        foreach ($this->shops() as $shop) {
            // ショップ情報も削除
            $shop->delete();
        }

        return parent::delete();
    }

    /**
     * ソフト関連付けも一緒に登録
     *
     * @param array $softs
     * @param array $options
     * @return bool
     * @throws \Throwable
     */
    public function saveWithSoftRelation(array $softs, array $options = []): bool
    {
        $result = true;
        DB::beginTransaction();

        try {
            if (!$this->save($options)) {
                $result = false;
            } else {
                $this->softs()->sync($softs);
                DB::commit();
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $result = false;
        }

        return $result;
    }
}
