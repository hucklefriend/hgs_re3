<?php

namespace App\Services\Rss;

class MatchResult
{
    public function __construct(
        /** @var int[] */
        public readonly array $matchedTitleIds,
        /** @var int[] */
        public readonly array $matchedFranchiseIds,
        public readonly bool $hasHorrorKeyword,
    ) {}

    public function hasAnyMatch(): bool
    {
        return $this->hasHorrorKeyword
            || !empty($this->matchedTitleIds)
            || !empty($this->matchedFranchiseIds);
    }
}
