import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * Performance Module - End-to-End Tests
 * Tests for manage reviews, trackers, and configure tabs
 */

test.describe('Performance Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-PERF-001: Verify Performance page loads', async ({ performancePage }) => {
    await performancePage.goto();
    await performancePage.expectPerformancePageLoaded();
  });

  test('TC-PERF-002: Verify top bar tabs are visible', async ({ performancePage }) => {
    await performancePage.goto();
    await performancePage.expectPerformancePageLoaded();
    await performancePage.expectTopBarTabsVisible();
  });

  test('TC-PERF-003: Navigate to Manage Reviews', async ({ performancePage, page }) => {
    await performancePage.goto();
    await performancePage.expectPerformancePageLoaded();

    await performancePage.clickManageReviews();
    await expect(page).toHaveURL(/.*performance/, { timeout: 15000 });
  });

  test('TC-PERF-004: Navigate to My Trackers', async ({ performancePage, page }) => {
    await performancePage.goto();
    await performancePage.expectPerformancePageLoaded();

    await performancePage.clickMyTrackers();
    await expect(page).toHaveURL(/.*performance/, { timeout: 15000 });
  });

  test('TC-PERF-005: Navigate to Employee Trackers', async ({ performancePage, page }) => {
    await performancePage.goto();
    await performancePage.expectPerformancePageLoaded();

    await performancePage.clickEmployeeTrackers();
    await expect(page).toHaveURL(/.*performance/, { timeout: 15000 });
  });

  test('TC-PERF-006: Configure tab opens with sub-menu', async ({ performancePage }) => {
    await performancePage.goto();
    await performancePage.expectPerformancePageLoaded();

    await performancePage.clickConfigureTab();
    await expect(performancePage.kpisTab).toBeVisible({ timeout: 5000 });
    await expect(performancePage.trackersTab).toBeVisible({ timeout: 5000 });
  });

  test('TC-PERF-007: Navigate to My Trackers directly', async ({ performancePage, page }) => {
    await performancePage.gotoMyTrackers();
    await expect(page).toHaveURL(/.*performance\/viewMyPerformanceTrackerList/, { timeout: 15000 });
  });

  test('TC-PERF-008: Navigate to Employee Trackers directly', async ({ performancePage, page }) => {
    await performancePage.gotoEmployeeTrackers();
    await expect(page).toHaveURL(/.*performance\/viewEmployeePerformanceTrackerList/, { timeout: 15000 });
  });

  test('TC-PERF-009: Verify Manage Reviews search form elements', async ({ performancePage }) => {
    await performancePage.goto();
    await performancePage.expectPerformancePageLoaded();

    // Navigate to Manage Reviews tab to see search form
    await performancePage.clickManageReviews();
    await expect(performancePage.searchButton).toBeVisible({ timeout: 10000 });
  });
});
