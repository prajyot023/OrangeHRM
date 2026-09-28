import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * Time Module - End-to-End Tests
 * Tests for timesheets, attendance records, and navigation tabs
 */

test.describe('Time Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-TIME-001: Verify Time page loads', async ({ timePage }) => {
    await timePage.goto();
    await timePage.expectTimePageLoaded();
  });

  test('TC-TIME-002: Verify top bar tabs are visible', async ({ timePage }) => {
    await timePage.goto();
    await timePage.expectTimePageLoaded();
    await timePage.expectTopBarTabsVisible();
  });

  test('TC-TIME-003: Verify Employee Timesheet form elements', async ({ timePage }) => {
    await timePage.goto();
    await timePage.expectTimePageLoaded();

    await expect(timePage.employeeNameInput).toBeVisible();
    await expect(timePage.viewButton).toBeVisible();
  });

  test('TC-TIME-004: Navigate to My Timesheet via sub-menu', async ({ timePage, page }) => {
    await timePage.goto();
    await timePage.expectTimePageLoaded();

    await timePage.navigateToMyTimesheets();
    await expect(page).toHaveURL(/.*time\/viewMyTimesheet/, { timeout: 15000 });
  });

  test('TC-TIME-005: Navigate to Attendance > My Records', async ({ timePage, page }) => {
    await timePage.goto();
    await timePage.expectTimePageLoaded();

    await timePage.navigateToMyRecords();
    await expect(page).toHaveURL(/.*attendance\/viewMyAttendanceRecord/, { timeout: 15000 });
  });

  test('TC-TIME-006: Navigate to Attendance > Punch In/Out', async ({ timePage, page }) => {
    await timePage.goto();
    await timePage.expectTimePageLoaded();

    await timePage.navigateToPunchInOut();
    await expect(page).toHaveURL(/.*attendance\/punchIn|.*attendance\/punchOut/, { timeout: 15000 });
  });

  test('TC-TIME-007: Navigate directly to My Timesheet', async ({ timePage, page }) => {
    await timePage.gotoMyTimesheet();
    await expect(page).toHaveURL(/.*time\/viewMyTimesheet/, { timeout: 15000 });
  });

  test('TC-TIME-008: Timesheets tab dropdown opens', async ({ timePage }) => {
    await timePage.goto();
    await timePage.expectTimePageLoaded();

    await timePage.clickTimesheetsTab();
    await expect(timePage.myTimesheetTab).toBeVisible({ timeout: 5000 });
    await expect(timePage.employeeTimesheetTab).toBeVisible({ timeout: 5000 });
  });

  test('TC-TIME-009: Attendance tab dropdown opens', async ({ timePage }) => {
    await timePage.goto();
    await timePage.expectTimePageLoaded();

    await timePage.clickAttendanceTab();
    await expect(timePage.myRecordsTab).toBeVisible({ timeout: 5000 });
    await expect(timePage.punchInOutTab).toBeVisible({ timeout: 5000 });
    await expect(timePage.employeeRecordsTab).toBeVisible({ timeout: 5000 });
  });
});
