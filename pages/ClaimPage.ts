import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectDropdownOption, readRecordCount } from '../utils/helpers';

/**
 * ClaimPage - Page Object Model for OrangeHRM Claim Module
 * URL: /web/index.php/claim/viewAssignClaim
 */
export class ClaimPage extends BasePage {
  // Top bar navigation tabs
  readonly configurationTab: Locator;
  readonly submitClaimTab: Locator;
  readonly myClaimsTab: Locator;
  readonly employeeClaimsTab: Locator;
  readonly assignClaimTab: Locator;

  // Configuration sub-tabs
  readonly eventsTab: Locator;
  readonly expenseTypesTab: Locator;

  // Employee Claims search form
  readonly employeeNameInput: Locator;
  readonly referenceIdInput: Locator;
  readonly eventNameDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Claims table
  readonly claimsTable: Locator;
  readonly tableRows: Locator;
  readonly noRecordsFound: Locator;
  readonly recordsCount: Locator;

  // Submit Claim form
  readonly claimEventDropdown: Locator;
  readonly claimCurrencyDropdown: Locator;
  readonly claimRemarksInput: Locator;
  readonly createClaimButton: Locator;

  // Top bar nav container
  readonly topBarNav: Locator;

  constructor(page: Page) {
    super(page);

    this.topBarNav = page.locator('.oxd-topbar-body-nav');

    // Navigation tabs are matched as links (the <a> itself, not the wrapping <li>)
    // so clicks land on the element carrying the navigation handler. Configuration
    // is a <span> dropdown toggle rather than a link, hence the different locator.
    this.configurationTab = page
      .locator('.oxd-topbar-body-nav-tab')
      .filter({ hasText: 'Configuration' })
      .first();
    this.submitClaimTab = this.topBarNav.getByRole('link', { name: 'Submit Claim', exact: true });
    this.myClaimsTab = this.topBarNav.getByRole('link', { name: 'My Claims', exact: true });
    this.employeeClaimsTab = this.topBarNav.getByRole('link', { name: 'Employee Claims', exact: true });
    this.assignClaimTab = this.topBarNav.getByRole('link', { name: 'Assign Claim', exact: true });

    // Configuration sub-tabs (rendered in the Configuration tab's dropdown)
    this.eventsTab = page.locator('a:has-text("Events")').first();
    this.expenseTypesTab = page.locator('a:has-text("Expense Types")').first();

    // Search form
    this.employeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    ).first();
    this.referenceIdInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Reference Id")) input'
    );
    this.eventNameDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Event Name")) .oxd-select-text'
    );
    this.statusDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Status")) .oxd-select-text'
    );
    this.fromDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("From Date")) input'
    );
    this.toDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("To Date")) input'
    );
    this.searchButton = page.locator('button[type="submit"]').first();
    this.resetButton = page.locator('button:has-text("Reset")');

    // Claims table
    this.claimsTable = page.locator('.oxd-table');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.noRecordsFound = page.locator('.oxd-text:has-text("No Records Found")');
    this.recordsCount = page.locator('.orangehrm-horizontal-padding .oxd-text:has-text("Record")').first();

    // Submit Claim form
    this.claimEventDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Event")) .oxd-select-text'
    );
    this.claimCurrencyDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Currency")) .oxd-select-text'
    );
    this.claimRemarksInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Remarks")) textarea'
    );
    this.createClaimButton = page.locator('button[type="submit"]:has-text("Create")');
  }

  /**
   * Navigate to Assign Claim page (the module's default landing page)
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/claim/assignClaim');
  }

  /**
   * Navigate to Employee Claims page
   */
  async gotoEmployeeClaims(): Promise<void> {
    await this.navigateTo('/web/index.php/claim/viewAssignClaim');
  }

  /**
   * Navigate to Submit Claim page
   */
  async gotoSubmitClaim(): Promise<void> {
    await this.navigateTo('/web/index.php/claim/submitClaim');
  }

  /**
   * Navigate to My Claims page
   */
  async gotoMyClaims(): Promise<void> {
    await this.navigateTo('/web/index.php/claim/viewClaim');
  }

  /**
   * Assert Claim page is loaded
   */
  async expectClaimPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*claim/, { timeout: 15000 });
  }

  /**
   * Assert top bar tabs are visible
   */
  async expectTopBarTabsVisible(): Promise<void> {
    // Wait for the topbar nav to be rendered before checking individual tabs
    await this.topBarNav.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.submitClaimTab).toBeVisible({ timeout: 10000 });
    await expect(this.myClaimsTab).toBeVisible({ timeout: 10000 });
  }

  /**
   * Click a top bar tab and wait for it to land on `urlPattern`.
   *
   * Every claim tab is an <a href="#"> that navigates from a JS click handler.
   * Letting click() auto-wait makes it hang on the "#" hash navigation until the
   * action timeout, so the click is fire-and-forget and the real destination is
   * awaited explicitly here instead.
   */
  private async clickTabAndWait(tab: Locator, urlPattern: RegExp): Promise<void> {
    await tab.click({ noWaitAfter: true });
    await this.page.waitForURL(urlPattern, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Click Submit Claim tab
   */
  async clickSubmitClaim(): Promise<void> {
    await this.clickTabAndWait(this.submitClaimTab, /\/claim\/submitClaim/);
  }

  /**
   * Click My Claims tab
   */
  async clickMyClaims(): Promise<void> {
    await this.clickTabAndWait(this.myClaimsTab, /\/claim\/viewClaim/);
  }

  /**
   * Click Employee Claims tab
   */
  async clickEmployeeClaims(): Promise<void> {
    await this.clickTabAndWait(this.employeeClaimsTab, /\/claim\/viewAssignClaim/);
  }

  /**
   * Click Assign Claim tab
   */
  async clickAssignClaim(): Promise<void> {
    await this.clickTabAndWait(this.assignClaimTab, /\/claim\/assignClaim/);
  }

  /**
   * Search claims by status
   */
  async searchByStatus(status: string): Promise<void> {
    await selectDropdownOption(
      this.page,
      '.oxd-input-group:has(.oxd-label:text("Status")) .oxd-select-text',
      status
    );
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Reset search filters
   */
  async resetSearch(): Promise<void> {
    await this.resetButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Get record count
   */
  async getRecordCount(): Promise<number> {
    return readRecordCount(this.page);
  }
}
