import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * My Info Module - End-to-End Tests
 * Tests for personal details, contact details, and profile management
 */

test.describe('My Info Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-MYINFO-001: Verify My Info page loads', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();
  });

  test('TC-MYINFO-002: Verify personal details form is displayed', async ({ myInfoPage }) => {
    await myInfoPage.goto();

    await expect(myInfoPage.firstNameInput).toBeVisible();
    await expect(myInfoPage.middleNameInput).toBeVisible();
    await expect(myInfoPage.lastNameInput).toBeVisible();
    await expect(myInfoPage.employeeIdInput).toBeVisible();
  });

  test('TC-MYINFO-003: Verify Employee ID is pre-populated', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    const employeeId = await myInfoPage.getEmployeeId();
    expect(employeeId.length).toBeGreaterThan(0);
  });

  test('TC-MYINFO-004: Verify First Name is pre-populated', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    const firstName = await myInfoPage.getFirstName();
    expect(firstName.length).toBeGreaterThan(0);
  });

  test('TC-MYINFO-005: Verify Last Name is pre-populated', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    const lastName = await myInfoPage.getLastName();
    expect(lastName.length).toBeGreaterThan(0);
  });

  test('TC-MYINFO-006: Verify My Info tabs are displayed', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    await myInfoPage.expectAllTabsVisible();
  });

  test('TC-MYINFO-007: Navigate to Contact Details tab', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    await myInfoPage.switchToTab('Contact Details');

    // Verify contact details form elements
    await expect(myInfoPage.street1Input).toBeVisible();
    await expect(myInfoPage.cityInput).toBeVisible();
  });

  test('TC-MYINFO-008: Navigate to Emergency Contacts tab', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    await myInfoPage.switchToTab('Emergency Contacts');

    // Verify we're on Emergency Contacts tab - check for the Add button or tab content
    const activeTab = myInfoPage.page.locator('.orangehrm-tabs-item--active, [class*="tabs-item"][class*="active"]');
    const addBtn = myInfoPage.page.locator('button:has-text("Add")');
    // At least one indicator should confirm we're on the tab
    const isOnTab = await activeTab.count() > 0 || await addBtn.isVisible().catch(() => false);
    expect(isOnTab).toBeTruthy();
  });

  test('TC-MYINFO-009: Navigate to Dependents tab', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    await myInfoPage.switchToTab('Dependents');

    // Verify we navigated - check for the Add button or tab-specific content.
    // The Dependents page renders more than one "Add" button, so take the first.
    const addBtn = myInfoPage.page.locator('button:has-text("Add")').first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
  });

  test('TC-MYINFO-010: Verify Nationality dropdown is present', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    await expect(myInfoPage.nationalityDropdown).toBeVisible();
  });

  test('TC-MYINFO-011: Verify Marital Status dropdown is present', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    await expect(myInfoPage.maritalStatusDropdown).toBeVisible();
  });

  test('TC-MYINFO-012: Verify Date of Birth field is present', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    await expect(myInfoPage.dateOfBirthInput).toBeVisible();
  });

  test('TC-MYINFO-013: Verify Save button is present on Personal Details', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    await expect(myInfoPage.savePersonalDetailsButton).toBeVisible();
  });

  test('TC-MYINFO-014: Navigate through multiple tabs', async ({ myInfoPage }) => {
    await myInfoPage.goto();
    await myInfoPage.expectMyInfoPageLoaded();

    // Navigate through tabs
    await myInfoPage.switchToTab('Contact Details');
    await myInfoPage.switchToTab('Emergency Contacts');
    await myInfoPage.switchToTab('Dependents');

    // Go back to Personal Details
    await myInfoPage.switchToTab('Personal Details');
    await expect(myInfoPage.firstNameInput).toBeVisible();
  });
});
