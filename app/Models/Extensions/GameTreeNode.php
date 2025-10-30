<?php

namespace App\Models\Extensions;


class GameTreeNode
{
    /**
     * @var GameTreeNode[]
     */
    private array $children = [];
    /**
     * @var GameTreeNode[]
     */
    private array $parent = [];

    /**
     * コンストラクタ
     *
     * @param int $id
     * @param string $name
     * @param string $acronym
     * @param bool $selected
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $acronym,
        public bool $selected = false)
    {
    }

    /**
     * 親ノードを取得
     *
     * @return GameTreeNode[]
     */
    public function getParent(): array
    {
        return $this->parent;
    }

    /**
     * 親ノードを追加
     *
     * @param GameTreeNode $parentNode
     */
    public function addParent(GameTreeNode $parentNode): void
    {
        if (isset($this->parent[$parentNode->id])) {
            $this->parent[$parentNode->id] = $parentNode;
        }
    }

    /**
     * 子ノードを取得
     *
     * @return GameTreeNode[]
     */
    public function getChildren(): array
    {
        return $this->children;
    }

    /**
     * 子ノードを追加
     *
     * @param GameTreeNode $childNode
     */
    public function addChild(GameTreeNode $childNode): void
    {
        if (!isset($this->children[$childNode->id])) {
            $this->children[$childNode->id] = $childNode;
        }
    }

    /**
     * 同じノードか
     *
     * @param GameTreeNode $node
     * @return bool
     */
    public function isSameNode(GameTreeNode $node): bool
    {
        return $this->id === $node->id && $this->acronym === $node->acronym;
    }

    public function mergeChildren(GameTreeNode $node): void
    {
        foreach ($node->children as $child) {
            if (!$this->existsSameChild($child)) {
                $this->addChild($child);
            } else {
                $this->children[$child->id]->mergeChildren($child);
            }
        }
    }

    public function existsSameChild(GameTreeNode $node): bool
    {
        return isset($this->children[$node->id]) && $this->children[$node->id]->isSameNode($node);
    }

    /**
     * 詳細ページのURLを取得
     *
     * @return string
     */
    public function getDetailUrl(): string
    {
        return match($this->acronym) {
            'FC' => route('Admin.Game.Franchise.Detail', ['franchise' => $this->id]),
            'SER' => route('Admin.Game.Series.Detail', ['series' => $this->id]),
            'TTL' => route('Admin.Game.Title.Detail', ['title' => $this->id]),
            'PKG' => route('Admin.Game.Package.Detail', ['package' => $this->id]),
            'PKGG' => route('Admin.Game.PackageGroup.Detail', ['packageGroup' => $this->id]),
            'MM' => route('Admin.Game.MediaMix.Detail', ['media_mix' => $this->id]),
            'MMG' => route('Admin.Game.MediaMixGroup.Detail', ['media_mix_group' => $this->id]),
            'RP' => route('Admin.Game.RelatedProduct.Detail', ['relatedProduct' => $this->id]),
            'PLT' => route('Admin.Game.Platform.Detail', ['platform' => $this->id]),
            default => '#'
        };
    }
}
