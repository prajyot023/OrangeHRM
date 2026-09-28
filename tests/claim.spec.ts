import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * Claim Module - End-to-End Tests
 * Tests for claims listing, tab navigation, submit claim, and my claims
 */

test.describe('Claim Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-CLAIM-001: Verify Claim page loads', async ({ claimPage }) => {
    await claimPage.goto();
    await claimPage.expectClaimPageLoaded();
  });

  test('TC-CLAIM-002: Verify top bar tabs are visible', async ({ claimPage }) => {
    await claimPage.goto();
    await claimPage.expectClaimPageLoaded();
    await claimPage.expectTopBarTabsVisible();
  });

  test('TC-CLAIM-003: Navigate to Submit Claim tab', async ({ claimPage, page }) => {
    await claimPage.goto();
    await claimPage.expectClaimPageLoaded();

    await claimPage.clickSubmitClaim();
    await expect(page).toHaveURL(/.*claim\/submitClaim/, { timeout: 15000 });
  });

  test('TC-CLAIM-004: Navigate to My Claims tab', async ({ claimPage, page }) => {
    await claimPage.goto();
    await claimPage.expectClaimPageLoaded();

    await claimPage.clickMyClaims();
    await expect(page).toHaveURL(/.*claim\/viewClaim/, { timeout: 15000 });
  });

  test('TC-CLAIM-005: Navigate to Employee Claims tab', async ({ claimPage, page }) => {
    await claimPage.goto();
    await claimPage.expectClaimPageLoaded();

    await claimPage.clickEmployeeClaims();
    await expect(page).toHaveURL(/.*claim\/viewAssignClaim/, { timeout: 15000 });
  });

  test('TC-CLAIM-006: Navigate to Assign Claim tab', async ({ claimPage, page }) => {
    // Navigate to My Claims first so clicking Assign Claim causes a URL change
    await claimPage.gotoMyClaims();
    await claimPage.expectClaimPageLoaded();

    await claimPage.clickAssignClaim();
    await expect(page).toHaveURL(/.*claim\/assignClaim/, { timeout: 15000 });
  });

  test('TC-CLAIM-007: Verify Submit Claim form elements', async ({ claimPage }) => {
    await claimPage.gotoSubmitClaim();
    await claimPage.expectClaimPageLoaded();

    await expect(claimPage.claimEventDropdown).toBeVisible({ timeout: 10000 });
    await expect(claimPage.claimCurrencyDropdown).toBeVisible({ timeout: 10000 });
    await expect(claimPage.claimRemarksInput).toBeVisible({ timeout: 10000 });
    await expect(claimPage.createClaimButton).toBeVisible({ timeout: 10000 });
  });

  test('TC-CLAIM-008: Navigate to My Claims directly', async ({ claimPage, page }) => {
    await claimPage.gotoMyClaims();
    await expect(page).toHaveURL(/.*claim\/viewClaim/, { timeout: 15000 });
  });

  test('TC-CLAIM-009: Configuration tab opens with sub-menu', async ({ claimPage }) => {
    await claimPage.goto();
    await claimPage.expectClaimPageLoaded();

    await claimPage.configurationTab.click();
    await expect(claimPage.eventsTab).toBeVisible({ timeout: 5000 });
    await expect(claimPage.expenseTypesTab).toBeVisible({ timeout: 5000 });
  });
});
