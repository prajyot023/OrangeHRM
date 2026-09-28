import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * Admin Module - End-to-End Tests
 * Tests for system user management, search, and user operations
 */

test.describe('Admin Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-ADMIN-001: Verify Admin page loads', async ({ adminPage }) => {
    await adminPage.goto();
    await adminPage.expectAdminPageLoaded();
  });

  test('TC-ADMIN-002: Verify system user table is displayed', async ({ adminPage }) => {
    await adminPage.goto();

    await expect(adminPage.userTable).toBeVisible();
    const recordCount = await adminPage.getRecordCount();
    expect(recordCount).toBeGreaterThan(0);
  });

  test('TC-ADMIN-003: Verify search form fields', async ({ adminPage }) => {
    await adminPage.goto();

    await expect(adminPage.usernameInput).toBeVisible();
    await expect(adminPage.userRoleDropdown).toBeVisible();
    await expect(adminPage.statusDropdown).toBeVisible();
    await expect(adminPage.searchButton).toBeVisible();
    await expect(adminPage.resetButton).toBeVisible();
  });

  test('TC-ADMIN-004: Search user by username', async ({ adminPage }) => {
    await adminPage.goto();
    await adminPage.expectAdminPageLoaded();

    await adminPage.searchByUsername('Admin');

    const recordCount = await adminPage.getRecordCount();
    expect(recordCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-ADMIN-005: Search user by User Role - Admin', async ({ adminPage }) => {
    await adminPage.goto();
    await adminPage.expectAdminPageLoaded();

    await adminPage.searchByUserRole('Admin');

    const recordCount = await adminPage.getRecordCount();
    expect(recordCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-ADMIN-006: Search user by Status - Enabled', async ({ adminPage }) => {
    await adminPage.goto();
    await adminPage.expectAdminPageLoaded();

    await adminPage.searchByStatus('Enabled');

    const recordCount = await adminPage.getRecordCount();
    expect(recordCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-ADMIN-007: Reset search filters', async ({ adminPage }) => {
    await adminPage.goto();
    await adminPage.expectAdminPageLoaded();

    // Apply a search
    await adminPage.searchByUsername('Admin');

    // Reset filters
    await adminPage.resetSearch();

    // Verify all results are shown again
    const usernameValue = await adminPage.usernameInput.inputValue();
    expect(usernameValue).toBe('');
  });

  test('TC-ADMIN-008: Navigate to Add User page', async ({ adminPage, page }) => {
    await adminPage.goto();
    await adminPage.expectAdminPageLoaded();

    await adminPage.clickAddUser();
    await expect(page).toHaveURL(/.*admin\/saveSystemUser/);
  });

  test('TC-ADMIN-009: Verify Add User form fields', async ({ adminPage }) => {
    await adminPage.goto();
    await adminPage.clickAddUser();

    await expect(adminPage.addUserRoleDropdown).toBeVisible();
    await expect(adminPage.addStatusDropdown).toBeVisible();
    await expect(adminPage.addUsernameInput).toBeVisible();
    await expect(adminPage.addPasswordInput).toBeVisible();
    await expect(adminPage.addConfirmPasswordInput).toBeVisible();
    await expect(adminPage.saveButton).toBeVisible();
    await expect(adminPage.cancelButton).toBeVisible();
  });

  test('TC-ADMIN-010: Cancel Add User returns to user list', async ({ adminPage, page }) => {
    await adminPage.goto();
    await adminPage.clickAddUser();
    await adminPage.cancelButton.click();

    await expect(page).toHaveURL(/.*admin\/viewSystemUsers/);
  });
});
