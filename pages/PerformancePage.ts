import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * PerformancePage - Page Object Model for OrangeHRM Performance Module
 * URL: /web/index.php/performance/searchEvaluatePerformanceReview
 */
export class PerformancePage extends BasePage {
  // Top bar navigation tabs
  readonly configureTab: Locator;
  readonly manageReviewsTab: Locator;
  readonly myTrackersTab: Locator;
  readonly employeeTrackersTab: Locator;

  // Configure sub-tabs
  readonly kpisTab: Locator;
  readonly trackersTab: Locator;

  // Manage Reviews search form
  readonly employeeNameInput: Locator;
  readonly jobTitleDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly subUnitDropdown: Locator;
  readonly reviewerInput: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Reviews table
  readonly reviewsTable: Locator;
  readonly tableRows: Locator;
  readonly noRecordsFound: Locator;

  constructor(page: Page) {
    super(page);

    // Top bar tabs – use filter for more resilient matching
    this.configureTab = page.locator('.oxd-topbar-body-nav-tab').filter({ hasText: 'Configure' }).first();
    this.manageReviewsTab = page.locator('.oxd-topbar-body-nav-tab').filter({ hasText: 'Manage Reviews' }).first();
    this.myTrackersTab = page.locator('.oxd-topbar-body-nav-tab').filter({ hasText: 'My Trackers' }).first();
    this.employeeTrackersTab = page.locator('.oxd-topbar-body-nav-tab').filter({ hasText: 'Employee Trackers' }).first();

    // Configure sub-tabs
    this.kpisTab = page.locator('.oxd-topbar-body-nav-tab-link', { hasText: 'KPIs' }).first();
    this.trackersTab = page.locator('.oxd-topbar-body-nav-tab-link', { hasText: 'Trackers' }).first();

    // Search form
    this.employeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    ).first();
    this.jobTitleDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Job Title")) .oxd-select-text'
    );
    this.statusDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Status")) .oxd-select-text'
    );
    this.subUnitDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Sub Unit")) .oxd-select-text'
    );
    this.reviewerInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Reviewer")) input'
    ).first();
    this.fromDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("From Date")) input'
    );
    this.toDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("To Date")) input'
    );
    this.searchButton = page.locator('button[type="submit"]').first();
    this.resetButton = page.locator('button:has-text("Reset")');

    // Reviews table
    this.reviewsTable = page.locator('.oxd-table');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.noRecordsFound = page.locator('.oxd-text:has-text("No Records Found")');
  }

  /**
   * Navigate to Performance module (Manage Reviews)
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/performance/searchEvaluatePerformanceReview');
  }

  /**
   * Navigate to My Trackers
   */
  async gotoMyTrackers(): Promise<void> {
    await this.navigateTo('/web/index.php/performance/viewMyPerformanceTrackerList');
  }

  /**
   * Navigate to Employee Trackers
   */
  async gotoEmployeeTrackers(): Promise<void> {
    await this.navigateTo('/web/index.php/performance/viewEmployeePerformanceTrackerList');
  }

  /**
   * Assert Performance page is loaded
   */
  async expectPerformancePageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*performance/, { timeout: 15000 });
  }

  /**
   * Assert top bar tabs are visible
   */
  async expectTopBarTabsVisible(): Promise<void> {
    await this.page.locator('.oxd-topbar-body-nav').waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.configureTab).toBeVisible({ timeout: 10000 });
    await expect(this.manageReviewsTab).toBeVisible({ timeout: 10000 });
    await expect(this.myTrackersTab).toBeVisible({ timeout: 10000 });
    await expect(this.employeeTrackersTab).toBeVisible({ timeout: 10000 });
  }

  /**
   * Click Manage Reviews tab
   */
  async clickManageReviews(): Promise<void> {
    await this.manageReviewsTab.click();
    await this.waitForPageLoad();
  }

  /**
   * Click My Trackers tab.
   * The topbar tabs are href="#" and routed in JS, so the click is only really
   * finished once the router has swapped the URL -- waiting on the load state
   * alone would return while the old page is still on screen.
   */
  async clickMyTrackers(): Promise<void> {
    await this.myTrackersTab.click();
    await this.page.waitForURL('**/performance/viewMyPerformanceTrackerList', {
      timeout: 30000,
      waitUntil: 'domcontentloaded',
    });
    await this.waitForPageLoad();
  }

  /**
   * Click Employee Trackers tab
   */
  async clickEmployeeTrackers(): Promise<void> {
    await this.employeeTrackersTab.click();
    await this.page.waitForURL('**/performance/viewEmployeePerformanceTrackerList', {
      timeout: 30000,
      waitUntil: 'domcontentloaded',
    });
    await this.waitForPageLoad();
  }

  /**
   * Click Configure tab to expand sub-menu
   */
  async clickConfigureTab(): Promise<void> {
    await this.configureTab.click();
  }
}
