<?php

namespace App\Models\Extensions;


use App\Models\GameFranchise;
use App\Models\GameMediaMix;
use App\Models\GameMediaMixGroup;
use App\Models\GamePackage;
use App\Models\GamePackageGroup;
use App\Models\GamePlatform;
use App\Models\GameRelatedProduct;
use App\Models\GameSeries;
use App\Models\GameTitle;

class GameTree
{
    /**
     * ツリーを取得
     *
     * @param mixed $model
     * @return GameTreeNode[]
     */
    public static function getTree(mixed $model): array
    {
        $baseNode = new GameTreeNode($model->id, $model->name, self::getAcronym($model), true);
        self::addChild($model, $baseNode);
        $roots = [];
        self::addParent($model, $baseNode, $roots);
        return self::merge($roots);
    }

    /**
     * 親ノードを追加
     *
     * @param mixed $model
     * @param GameTreeNode $node
     * @param array $roots
     * @return void
     */
    private static function addParent(mixed $model, GameTreeNode $node, array &$roots): void
    {
        if ($model instanceof GameFranchise || $model instanceof GamePlatform) {
            $roots[] = $node;
        } else if ($model instanceof GameSeries) {
            if ($model->franchise !== null) {
                $parentNode = new GameTreeNode($model->franchise->id, $model->franchise->name . 'フランチャイズ', self::getAcronym($model->franchise));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                $roots[] = $parentNode;
            }
        } else if ($model instanceof GameTitle) {
            if ($model->series !== null) {
                $parentNode = new GameTreeNode($model->series->id, $model->series->name . 'シリーズ', self::getAcronym($model->series));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                self::addParent($model->series, $parentNode, $roots);
            }
            if ($model->franchise !== null) {
                $parentNode = new GameTreeNode($model->franchise->id, $model->franchise->name . 'フランチャイズ', self::getAcronym($model->franchise));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                $roots[] = $parentNode;
            }
        } else if ($model instanceof GamePackageGroup) {
            foreach ($model->titles as $title) {
                $parentNode = new GameTreeNode($title->id, $title->name, self::getAcronym($title));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                self::addParent($title, $parentNode, $roots);
            }
        } else if ($model instanceof GamePackage) {
            foreach ($model->packageGroups as $group) {
                $parentNode = new GameTreeNode($group->id, $group->name, self::getAcronym($group));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                self::addParent($group, $parentNode, $roots);
            }
            foreach ($model->titles as $title) {
                $parentNode = new GameTreeNode($title->id, $title->name, self::getAcronym($title));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                self::addParent($title, $parentNode, $roots);
            }
        } else if ($model instanceof GameMediaMixGroup) {
            if ($model->franchise !== null) {
                $parentNode = new GameTreeNode($model->franchise->id, $model->franchise->name . 'フランチャイズ', self::getAcronym($model->franchise));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                $roots[] = $parentNode;
            }
        } else if ($model instanceof GameMediaMix) {
            if ($model->mediaMixGroup !== null) {
                $parentNode = new GameTreeNode($model->mediaMixGroup->id, $model->mediaMixGroup->name, self::getAcronym($model->mediaMixGroup));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                self::addParent($model->mediaMixGroup, $parentNode, $roots);
            }
            if ($model->franchise !== null) {
                $parentNode = new GameTreeNode($model->franchise->id, $model->franchise->name . 'フランチャイズ', self::getAcronym($model->franchise));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                $roots[] = $parentNode;
            }
            foreach ($model->titles as $title) {
                $parentNode = new GameTreeNode($title->id, $title->name, self::getAcronym($title));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                self::addParent($title, $parentNode, $roots);
            }
        } else if ($model instanceof GameRelatedProduct) {
            foreach ($model->platforms as $plt) {
                $parentNode = new GameTreeNode($plt->id, $plt->name . 'プラットフォーム', self::getAcronym($plt));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                self::addParent($plt, $parentNode, $roots);
            }
            foreach ($model->titles as $title) {
                $parentNode = new GameTreeNode($title->id, $title->name, self::getAcronym($title));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                self::addParent($title, $parentNode, $roots);
            }
            foreach ($model->mediaMixes as $mm) {
                $parentNode = new GameTreeNode($mm->id, $mm->name, self::getAcronym($mm));
                $parentNode->addChild($node);
                $node->addParent($parentNode);
                self::addParent($mm, $parentNode, $roots);
            }
        }
    }

    /**
     * 子ノードを追加
     *
     * @param mixed $model
     * @param GameTreeNode $node
     */
    private static function addChild(mixed $model, GameTreeNode $node): void
    {
        if ($model instanceof GameFranchise) {
            foreach ($model->series as $series) {
                $childNode = new GameTreeNode($series->id, $series->name . 'シリーズ', self::getAcronym($series));
                $node->addChild($childNode);
                self::addChild($series, $childNode);
            }
            foreach ($model->titles as $title) {
                $childNode = new GameTreeNode($title->id, $title->name, self::getAcronym($title));
                $node->addChild($childNode);
                self::addChild($title, $childNode);
            }
            foreach ($model->mediaMixGroups as $mmg) {
                $childNode = new GameTreeNode($mmg->id, $mmg->name, self::getAcronym($mmg));
                $node->addChild($childNode);
                self::addChild($mmg, $childNode);
            }
            foreach ($model->mediaMixes as $mm) {
                $childNode = new GameTreeNode($mm->id, $mm->name, self::getAcronym($mm));
                $node->addChild($childNode);
                self::addChild($mm, $childNode);
            }
        } else if ($model instanceof GameSeries) {
            foreach ($model->titles as $title) {
                $childNode = new GameTreeNode($title->id, $title->name, self::getAcronym($title));
                $node->addChild($childNode);
                self::addChild($title, $childNode);
            }
        } else if ($model instanceof GameTitle) {
            foreach ($model->packageGroups as $group) {
                $childNode = new GameTreeNode($group->id, $group->name, self::getAcronym($group));
                $node->addChild($childNode);
                self::addChild($group, $childNode);
            }
            foreach ($model->packages as $pkg) {
                $childNode = new GameTreeNode($pkg->id, "[" . $pkg->platform->acronym . "]" . $pkg->name, self::getAcronym($pkg));
                $node->addChild($childNode);
                self::addChild($pkg, $childNode);
            }
            foreach ($model->mediaMixes as $mm) {
                $childNode = new GameTreeNode($mm->id, $mm->name, self::getAcronym($mm));
                $node->addChild($childNode);
                self::addChild($mm, $childNode);
            }
            foreach ($model->relatedProducts as $rp) {
                $childNode = new GameTreeNode($rp->id, $rp->name, self::getAcronym($rp));
                $node->addChild($childNode);
                self::addChild($rp, $childNode);
            }
        } else if ($model instanceof GamePackageGroup) {
            foreach ($model->packages as $package) {
                $childNode = new GameTreeNode($package->id, $package->name, self::getAcronym($package));
                $node->addChild($childNode);
                self::addChild($package, $childNode);
            }
        } else if ($model instanceof GameMediaMixGroup) {
            foreach ($model->mediaMixes as $mix) {
                $childNode = new GameTreeNode($mix->id, $mix->name, self::getAcronym($mix));
                $node->addChild($childNode);
                self::addChild($mix, $childNode);
            }
        } else if ($model instanceof GameMediaMix) {
            foreach ($model->relatedProducts as $rp) {
                $childNode = new GameTreeNode($rp->id, $rp->name, self::getAcronym($rp));
                $node->addChild($childNode);
                self::addChild($rp, $childNode);
            }
        }
    }

    /**
     * ツリーをマージ
     *
     * @param GameTreeNode[] $roots
     * @return GameTreeNode[]
     */
    public static function merge(array $roots): array
    {
        $newRoots = [];
        $prevRoot = null;
        foreach ($roots as $root) {
            if ($prevRoot === null) {
                $prevRoot = $root;
                $newRoots[] = $prevRoot;
                continue;
            }

            if ($prevRoot->isSameNode($root)) {
                $prevRoot->mergeChildren($root);
            } else {
                $newRoots[] = $root;
            }
        }

        return $newRoots;
    }

    /**
     * 略称を取得
     *
     * @param mixed $model
     * @return string
     */
    public static function getAcronym(mixed $model): string
    {
        $acronym = '';

        if (is_object($model)) {
            $className = basename(str_replace('\\', '/', $model::class));
            $acronym = match ($className) {
                'GameFranchise' => 'FC',
                'GameSeries' => 'SER',
                'GameTitle' => 'TTL',
                'GamePackageGroup' => 'PKGG',
                'GamePackage' => 'PKG',
                'GameMediaMixGroup' => 'MMG',
                'GameMediaMix' => 'MM',
                'GamePlatform' => 'PLT',
                'GameMaker' => 'MKR',
                'GameRelatedProduct' => 'RP',
                default => '',
            };
        }

        return $acronym;
    }
}
