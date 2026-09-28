import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * Maintenance Module - End-to-End Tests
 * Tests for admin access prompt, password confirmation, and purge employee flow
 */

test.describe('Maintenance Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-MAINT-001: Verify Maintenance page loads with admin access prompt', async ({ maintenancePage }) => {
    await maintenancePage.goto();
    await maintenancePage.expectMaintenancePageLoaded();
    await maintenancePage.expectAdminAccessPrompt();
  });

  test('TC-MAINT-002: Verify admin password input is visible', async ({ maintenancePage }) => {
    await maintenancePage.goto();
    await maintenancePage.expectAdminAccessPrompt();

    await expect(maintenancePage.adminPasswordInput).toBeVisible();
  });

  test('TC-MAINT-003: Verify Confirm button is visible', async ({ maintenancePage }) => {
    await maintenancePage.goto();
    await maintenancePage.expectAdminAccessPrompt();

    await expect(maintenancePage.confirmButton).toBeVisible();
  });

  test('TC-MAINT-004: Submit empty password shows validation error', async ({ maintenancePage }) => {
    await maintenancePage.goto();
    await maintenancePage.expectAdminAccessPrompt();

    await maintenancePage.submitEmptyPassword();
    await expect(maintenancePage.passwordRequiredError).toBeVisible({ timeout: 5000 });
  });

  test('TC-MAINT-005: Confirm admin access with valid password', async ({ maintenancePage }) => {
    await maintenancePage.goto();
    await maintenancePage.expectAdminAccessPrompt();

    await maintenancePage.confirmAdminAccess(Credentials.ADMIN.password);
    // After successful confirmation, the purge form should be visible
    await maintenancePage.expectMaintenancePageLoaded();
  });

  test('TC-MAINT-006: Verify Purge Employee form after access', async ({ maintenancePage }) => {
    await maintenancePage.goto();
    await maintenancePage.expectAdminAccessPrompt();
    await maintenancePage.confirmAdminAccess(Credentials.ADMIN.password);

    // The purge employee name input and search button should be visible
    await expect(maintenancePage.purgeEmployeeNameInput).toBeVisible({ timeout: 10000 });
    await expect(maintenancePage.purgeSearchButton).toBeVisible({ timeout: 10000 });
  });
});
