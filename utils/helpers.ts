import { Page, expect } from '@playwright/test';

/**
 * Helper utilities for OrangeHRM E2E tests
 */

/**
 * Wait for the OrangeHRM spinner/loader to disappear
 */
export async function waitForSpinnerToDisappear(page: Page): Promise<void> {
  const spinner = page.locator('.oxd-loading-spinner');
  // Only wait if spinner is visible
  if (await spinner.isVisible({ timeout: 2000 }).catch(() => false)) {
    await spinner.waitFor({ state: 'hidden', timeout: 15000 });
  }
}

/**
 * How long an empty result has to hold still before we believe it.
 */
const EMPTY_SETTLE_MS = 3000;

/**
 * Read the "(N) Records Found" counter that OrangeHRM list pages render above
 * their results.
 *
 * Two things make this harder than it looks:
 *
 *  - "No Records Found" is the grid's *initial* state, rendered before the list
 *    request has even been sent, so seeing it is not evidence of an empty
 *    result. On the directory it shows for ~2.5s on every single load.
 *  - On some modules that message occupies the very same slot as the counter,
 *    so the counter locator matches it and its text has no "(N)" to parse.
 *
 * So: a counter carrying a number is trusted immediately, while an empty result
 * is only trusted once no spinner is up and the empty state has held still for
 * EMPTY_SETTLE_MS. Callers get the real count instead of a 0 scraped off a grid
 * that had not loaded yet, and a genuinely empty search still returns promptly
 * rather than timing out.
 */
export async function readRecordCount(page: Page, timeout = 30000): Promise<number> {
  const counter = page
    .locator('.orangehrm-horizontal-padding .oxd-text:has-text("Record")')
    .first();
  const emptyMarker = page.locator('.oxd-text:has-text("No Records Found")');
  const spinner = page.locator('.oxd-loading-spinner');

  const deadline = Date.now() + timeout;
  let emptySince: number | null = null;

  while (Date.now() < deadline) {
    const loading = (await spinner.count()) > 0;
    if (loading) {
      emptySince = null;
    } else {
      const text = (await counter.count()) ? (await counter.textContent()) || '' : '';
      const match = text.match(/\((\d+)\)/);
      if (match) return parseInt(match[1], 10);

      const isEmpty = /No Records Found/.test(text) || (await emptyMarker.count()) > 0;
      if (isEmpty) {
        emptySince ??= Date.now();
        if (Date.now() - emptySince >= EMPTY_SETTLE_MS) return 0;
      } else {
        emptySince = null;
      }
    }
    await page.waitForTimeout(200);
  }

  throw new Error(
    `Timed out after ${timeout}ms waiting for a record count or a settled "No Records Found"`
  );
}

/**
 * Wait for toast message to appear and return its text
 */
export async function waitForToast(page: Page): Promise<string> {
  const toast = page.locator('.oxd-toast');
  await toast.waitFor({ state: 'visible', timeout: 10000 });
  const text = (await toast.textContent()) || '';
  return text;
}

/**
 * Generate a unique string for test data (avoids collisions)
 */
export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

/**
 * Generate a unique Employee Id that fits OrangeHRM's 10-character field.
 *
 * The Add Employee form pre-fills the next sequential id, but this is a shared
 * public demo: that id is regularly claimed by someone else between the form
 * rendering and the save, and the save is then rejected with "Employee Id
 * already exists". Supplying our own id keeps employee creation deterministic.
 */
export function generateEmployeeId(): string {
  return generateUniqueId().slice(0, 10);
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Select an option from OrangeHRM custom dropdown
 * These are oxd-select dropdowns, not native <select> elements
 */
export async function selectDropdownOption(
  page: Page,
  dropdownLocator: string,
  optionText: string
): Promise<void> {
  await page.locator(dropdownLocator).click();
  await page.locator('.oxd-select-dropdown').waitFor({ state: 'visible' });
  await page
    .locator('.oxd-select-dropdown .oxd-select-option')
    .filter({ hasText: optionText })
    .first()
    .click();
}

/**
 * Fill in an OrangeHRM autocomplete field and select from suggestions
 */
export async function fillAutocomplete(
  page: Page,
  inputLocator: string,
  searchText: string
): Promise<void> {
  await page.locator(inputLocator).fill(searchText);
  // Wait for autocomplete suggestions
  await page.waitForTimeout(1000);
  const options = page.locator('.oxd-autocomplete-option');
  if ((await options.count()) > 0) {
    await options.first().click();
  }
}

/**
 * Assert page header text
 */
export async function assertPageHeader(
  page: Page,
  expectedText: string
): Promise<void> {
  const header = page.locator('.oxd-topbar-header-breadcrumb h6, .oxd-topbar-header-breadcrumb .oxd-text');
  await expect(header.first()).toContainText(expectedText);
}
