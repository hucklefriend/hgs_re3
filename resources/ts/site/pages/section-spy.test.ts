import { describe, expect, it } from 'vitest';
import { resolveActiveSectionIndex } from './section-spy';

describe('resolveActiveSectionIndex', () => {
    it('基準線を最後に通過したセクションを選ぶ', () => {
        expect(resolveActiveSectionIndex([-500, 80, 520, 940], 240, false)).toBe(1);
        expect(resolveActiveSectionIndex([-900, -320, 220, 650], 240, false)).toBe(2);
    });

    it('上方向へ戻った場合も現在のセクションを選び直す', () => {
        expect(resolveActiveSectionIndex([225, 565, 980, 1400], 210, false)).toBe(0);
        expect(resolveActiveSectionIndex([-120, 225, 640, 1060], 210, false)).toBe(0);
    });

    it('ページ末尾では最後の短いセクションを選ぶ', () => {
        expect(resolveActiveSectionIndex([-1200, -700, -100, 500], 240, true)).toBe(3);
    });

    it('セクションがなければ選択しない', () => {
        expect(resolveActiveSectionIndex([], 240, false)).toBe(-1);
    });
});
