import { Page } from '@playwright/test';

/**
 * HGN のツリーノードが出現アニメーションを完了するまで待機する
 */
export const waitForTreeAppeared = async (page: Page): Promise<void> =>
{
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.waitForFunction(() =>
    (window as any)?.hgn?.currentNode?.nodeContentTree?.appearStatus === 2
  );
};

