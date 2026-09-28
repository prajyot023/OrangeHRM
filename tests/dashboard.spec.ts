import { test, expect } from '../fixtures/pageFixtures';
import { Credentials, SidebarMenuItems } from '../utils/testData';

/**
 * Dashboard Module - End-to-End Tests
 * Tests for dashboard widgets, sidebar navigation, user profile, and logout
 */

test.describe('Dashboard Page Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-DASH-001: Verify dashboard loads after login', async ({ dashboardPage }) => {
    await dashboardPage.expectDashboardLoaded();
  });

  test('TC-DASH-002: Verify dashboard page title', async ({ dashboardPage }) => {
    const title = await dashboardPage.getDashboardTitle();
    expect(title.trim()).toBe('Dashboard');
  });

  test('TC-DASH-003: Verify dashboard widgets are visible', async ({ dashboardPage }) => {
    await dashboardPage.expectWidgetsVisible();
  });

  test('TC-DASH-004: Verify widget count on dashboard', async ({ dashboardPage }) => {
    const widgetCount = await dashboardPage.getWidgetCount();
    expect(widgetCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-DASH-005: Verify sidebar menu items', async ({ dashboardPage }) => {
    const menuItems = await dashboardPage.getSidebarMenuItems();
    const menuTexts = menuItems.map((item) => item.trim());

    // Check that key menu items are present (case-insensitive)
    const hasItem = (name: string) =>
      menuTexts.some((t) => t.toLowerCase().includes(name.toLowerCase()));
    expect(hasItem('Admin')).toBeTruthy();
    expect(hasItem('PIM')).toBeTruthy();
    expect(hasItem('Leave')).toBeTruthy();
    expect(hasItem('Dashboard')).toBeTruthy();
    expect(hasItem('Directory')).toBeTruthy();
    expect(hasItem('My Info')).toBeTruthy();
  });

  test('TC-DASH-006: Verify logged-in user display name', async ({ dashboardPage }) => {
    const userName = await dashboardPage.getLoggedInUserName();
    expect(userName.trim().length).toBeGreaterThan(0);
  });

  test('TC-DASH-007: Navigate to PIM via sidebar', async ({ dashboardPage, page }) => {
    await dashboardPage.clickSidebarMenu('PIM');
    await expect(page).toHaveURL(/.*pim/);
  });

  test('TC-DASH-008: Navigate to Leave via sidebar', async ({ dashboardPage, page }) => {
    await dashboardPage.clickSidebarMenu('Leave');
    await expect(page).toHaveURL(/.*leave/);
  });

  test('TC-DASH-009: Navigate to Directory via sidebar', async ({ dashboardPage, page }) => {
    await dashboardPage.clickSidebarMenu('Directory');
    await expect(page).toHaveURL(/.*directory/);
  });

  test('TC-DASH-010: Navigate to My Info via sidebar', async ({ dashboardPage, page }) => {
    await dashboardPage.clickSidebarMenu('My Info');
    await expect(page).toHaveURL(/.*pim\/viewMyDetails|.*viewPersonalDetails/);
  });

  test('TC-DASH-011: Navigate to Admin via sidebar', async ({ dashboardPage, page }) => {
    await dashboardPage.clickSidebarMenu('Admin');
    await expect(page).toHaveURL(/.*admin/);
  });

  test('TC-DASH-012: Navigate to Buzz via sidebar', async ({ dashboardPage, page }) => {
    await dashboardPage.clickSidebarMenu('Buzz');
    await expect(page).toHaveURL(/.*buzz/);
  });

  test('TC-DASH-013: Logout from dashboard', async ({ dashboardPage, page }) => {
    await dashboardPage.logout();
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('TC-DASH-014: Verify sidebar search functionality', async ({ dashboardPage }) => {
    await dashboardPage.searchSidebar.fill('PIM');
    await dashboardPage.page.waitForTimeout(500);

    // After search, PIM should be visible
    const isPIMVisible = await dashboardPage.isSidebarMenuItemVisible('PIM');
    expect(isPIMVisible).toBeTruthy();
  });
});
