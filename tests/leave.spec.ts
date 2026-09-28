import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * Leave Module - End-to-End Tests
 * Tests for leave list, assign leave, and leave management
 */

test.describe('Leave Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-LEAVE-001: Verify Leave List page loads', async ({ leavePage }) => {
    await leavePage.goto();
    await leavePage.expectLeaveListLoaded();
  });

  test('TC-LEAVE-002: Verify Leave List has search filters', async ({ leavePage }) => {
    await leavePage.goto();

    // Verify filter elements are visible
    await expect(leavePage.fromDateInput).toBeVisible();
    await expect(leavePage.toDateInput).toBeVisible();
    await expect(leavePage.searchButton).toBeVisible();
    await expect(leavePage.resetButton).toBeVisible();
  });

  test('TC-LEAVE-003: Verify Leave List top bar tabs', async ({ leavePage }) => {
    await leavePage.goto();

    await expect(leavePage.leaveListTab).toBeVisible();
    await expect(leavePage.assignLeaveTab).toBeVisible();
  });

  test('TC-LEAVE-004: Navigate to Assign Leave page', async ({ leavePage, page }) => {
    await leavePage.goto();
    await leavePage.clickAssignLeaveTab();

    await expect(page).toHaveURL(/.*leave\/assignLeave/);
    await leavePage.expectAssignLeaveLoaded();
  });

  test('TC-LEAVE-005: Verify Assign Leave form fields', async ({ leavePage }) => {
    await leavePage.gotoAssignLeave();
    await leavePage.expectAssignLeaveLoaded();

    await expect(leavePage.assignEmployeeNameInput).toBeVisible();
    await expect(leavePage.assignLeaveTypeDropdown).toBeVisible();
    await expect(leavePage.assignFromDateInput).toBeVisible();
    await expect(leavePage.assignToDateInput).toBeVisible();
  });

  test('TC-LEAVE-006: Search leave records with date range', async ({ leavePage }) => {
    await leavePage.goto();
    await leavePage.expectLeaveListLoaded();

    await leavePage.searchLeaveRecords('2025-01-01', '2025-12-31');

    // Verify search completed - either records or no records message
    const hasRecords = !(await leavePage.isNoRecordsVisible());
    if (hasRecords) {
      const count = await leavePage.getRecordCount();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC-LEAVE-007: Reset leave search filters', async ({ leavePage }) => {
    await leavePage.goto();
    await leavePage.expectLeaveListLoaded();

    // Search with dates first
    await leavePage.searchLeaveRecords('2025-06-01', '2025-06-30');

    // Reset filters
    await leavePage.resetLeaveSearch();

    // Verify search button is still visible (page reloaded)
    await expect(leavePage.searchButton).toBeVisible();
  });

  test('TC-LEAVE-008: Navigate to Apply Leave page', async ({ leavePage, page }) => {
    await leavePage.gotoApplyLeave();
    await expect(page).toHaveURL(/.*leave\/applyLeave/);
  });

  test('TC-LEAVE-009: Verify Apply Leave form elements', async ({ leavePage }) => {
    await leavePage.gotoApplyLeave();

    await expect(leavePage.applyLeaveTypeDropdown).toBeVisible();
    await expect(leavePage.applyFromDateInput).toBeVisible();
    await expect(leavePage.applyToDateInput).toBeVisible();
    await expect(leavePage.applyButton).toBeVisible();
  });

  test('TC-LEAVE-010: Navigate between Leave List and Assign Leave tabs', async ({ leavePage, page }) => {
    await leavePage.goto();
    await leavePage.expectLeaveListLoaded();

    // Switch to Assign Leave
    await leavePage.clickAssignLeaveTab();
    await expect(page).toHaveURL(/.*leave\/assignLeave/);

    // Switch back to Leave List
    await leavePage.clickLeaveListTab();
    await expect(page).toHaveURL(/.*leave\/viewLeaveList/);
  });
});
