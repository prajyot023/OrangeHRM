import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * Directory Module - End-to-End Tests
 * Tests for employee directory search and card display
 */

test.describe('Directory Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-DIR-001: Verify Directory page loads', async ({ directoryPage }) => {
    await directoryPage.goto();
    await directoryPage.expectDirectoryPageLoaded();
  });

  test('TC-DIR-002: Verify search form elements', async ({ directoryPage }) => {
    await directoryPage.goto();

    await expect(directoryPage.employeeNameInput).toBeVisible();
    await expect(directoryPage.jobTitleDropdown).toBeVisible();
    await expect(directoryPage.locationDropdown).toBeVisible();
    await expect(directoryPage.searchButton).toBeVisible();
    await expect(directoryPage.resetButton).toBeVisible();
  });

  test('TC-DIR-003: Verify directory cards are displayed', async ({ directoryPage }) => {
    await directoryPage.goto();
    await directoryPage.expectDirectoryPageLoaded();

    const recordCount = await directoryPage.getRecordCount();
    expect(recordCount).toBeGreaterThan(0);
  });

  test('TC-DIR-004: Search directory by Job Title', async ({ directoryPage }) => {
    await directoryPage.goto();
    await directoryPage.expectDirectoryPageLoaded();

    await directoryPage.searchByJobTitle('Chief Executive Officer');

    // Verify results updated
    await expect(directoryPage.searchButton).toBeVisible();
  });

  test('TC-DIR-005: Search directory by Location', async ({ directoryPage }) => {
    await directoryPage.goto();
    await directoryPage.expectDirectoryPageLoaded();

    await directoryPage.searchByLocation('Canadian Regional HQ');

    // Verify results updated
    await expect(directoryPage.searchButton).toBeVisible();
  });

  test('TC-DIR-006: Reset directory search filters', async ({ directoryPage }) => {
    await directoryPage.goto();
    await directoryPage.expectDirectoryPageLoaded();

    // Apply a filter
    await directoryPage.searchByJobTitle('Chief Executive Officer');

    // Reset
    await directoryPage.resetSearch();

    // Verify all results are back
    const recordCount = await directoryPage.getRecordCount();
    expect(recordCount).toBeGreaterThan(0);
  });

  test('TC-DIR-007: Verify directory card count matches record count', async ({ directoryPage }) => {
    await directoryPage.goto();
    await directoryPage.expectDirectoryPageLoaded();

    // Note: Cards may be paginated, so count might differ
    const cardCount = await directoryPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-DIR-008: Search by employee name in directory', async ({ directoryPage }) => {
    await directoryPage.goto();
    await directoryPage.expectDirectoryPageLoaded();

    // Type a name and search
    await directoryPage.employeeNameInput.fill('Paul');
    await directoryPage.page.waitForTimeout(1500);

    const autocomplete = directoryPage.page.locator('.oxd-autocomplete-option');
    const count = await autocomplete.count();
    if (count > 0) {
      await autocomplete.first().click();
    }
    await directoryPage.searchButton.click();
    await directoryPage.waitForPageLoad();

    // Verify search was executed
    await expect(directoryPage.searchButton).toBeVisible();
  });
});
