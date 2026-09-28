import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectDropdownOption, fillAutocomplete, readRecordCount } from '../utils/helpers';

/**
 * LeavePage - Page Object Model for OrangeHRM Leave Module
 * URL: /web/index.php/leave/viewLeaveList
 */
export class LeavePage extends BasePage {
  // Leave List filter elements
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly leaveStatusDropdown: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly subUnitDropdown: Locator;
  readonly pastEmployeesDropdown: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Leave list table
  readonly leaveTable: Locator;
  readonly tableRows: Locator;
  readonly noRecordsFound: Locator;
  readonly recordsCount: Locator;

  // Top bar tabs
  readonly leaveListTab: Locator;
  readonly assignLeaveTab: Locator;

  // Assign Leave form
  readonly assignEmployeeNameInput: Locator;
  readonly assignLeaveTypeDropdown: Locator;
  readonly assignFromDateInput: Locator;
  readonly assignToDateInput: Locator;
  readonly assignCommentInput: Locator;
  readonly assignButton: Locator;

  // Modals
  readonly confirmAssignButton: Locator;

  // Apply Leave form elements
  readonly applyLeaveTypeDropdown: Locator;
  readonly applyFromDateInput: Locator;
  readonly applyToDateInput: Locator;
  readonly applyCommentInput: Locator;
  readonly applyButton: Locator;

  constructor(page: Page) {
    super(page);

    // Leave List filters
    this.fromDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("From Date")) input'
    );
    this.toDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("To Date")) input'
    );
    this.leaveStatusDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Show Leave with Status")) .oxd-select-text'
    );
    this.leaveTypeDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Leave Type")) .oxd-select-text'
    );
    this.employeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    ).first();
    this.subUnitDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Sub Unit")) .oxd-select-text'
    );
    this.pastEmployeesDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Past Employee")) .oxd-select-text'
    );
    this.searchButton = page.locator('button[type="submit"]').first();
    this.resetButton = page.locator('button:has-text("Reset")');

    // Leave table
    this.leaveTable = page.locator('.oxd-table');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.noRecordsFound = page.locator('.oxd-text:has-text("No Records Found")');
    this.recordsCount = page.locator('.orangehrm-horizontal-padding .oxd-text:has-text("Record")');

    // Top bar tabs
    this.leaveListTab = page.locator('.oxd-topbar-body-nav-tab:has-text("Leave List")');
    this.assignLeaveTab = page.locator('.oxd-topbar-body-nav-tab:has-text("Assign Leave")');

    // Assign Leave form
    this.assignEmployeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    ).first();
    this.assignLeaveTypeDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Leave Type")) .oxd-select-text'
    );
    this.assignFromDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("From Date")) input'
    );
    this.assignToDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("To Date")) input'
    );
    this.assignCommentInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Comment")) textarea'
    );
    this.assignButton = page.locator('button[type="submit"]:has-text("Assign")');

    // Confirm assign modal
    this.confirmAssignButton = page.locator('.orangehrm-modal-footer button:has-text("Ok")');

    // Apply Leave form
    this.applyLeaveTypeDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Leave Type")) .oxd-select-text'
    );
    this.applyFromDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("From Date")) input'
    );
    this.applyToDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("To Date")) input'
    );
    this.applyCommentInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Comments")) textarea'
    );
    this.applyButton = page.locator('button[type="submit"]:has-text("Apply")');
  }

  /**
   * Navigate to Leave List page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/leave/viewLeaveList');
  }

  /**
   * Navigate to Assign Leave page
   */
  async gotoAssignLeave(): Promise<void> {
    await this.navigateTo('/web/index.php/leave/assignLeave');
  }

  /**
   * Navigate to Apply Leave page
   */
  async gotoApplyLeave(): Promise<void> {
    await this.navigateTo('/web/index.php/leave/applyLeave');
  }

  /**
   * Assert Leave List page is loaded
   */
  async expectLeaveListLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*leave\/viewLeaveList/);
    await expect(this.searchButton).toBeVisible({ timeout: 15000 });
  }

  /**
   * Click Leave List tab
   */
  async clickLeaveListTab(): Promise<void> {
    await this.leaveListTab.click();
    await this.waitForPageLoad();
  }

  /**
   * Click Assign Leave tab
   */
  async clickAssignLeaveTab(): Promise<void> {
    await this.assignLeaveTab.click();
    await this.page.waitForURL('**/leave/assignLeave', { timeout: 10000 });
    await this.waitForPageLoad();
  }

  /**
   * Search leave records with filters
   */
  async searchLeaveRecords(fromDate?: string, toDate?: string): Promise<void> {
    if (fromDate) {
      await this.fromDateInput.click();
      // Triple-click to select all existing text, then type the new date
      await this.fromDateInput.press('Control+a');
      await this.fromDateInput.pressSequentially(fromDate, { delay: 50 });
      await this.page.keyboard.press('Escape'); // Close datepicker if open
    }
    if (toDate) {
      await this.toDateInput.click();
      await this.toDateInput.press('Control+a');
      await this.toDateInput.pressSequentially(toDate, { delay: 50 });
      await this.page.keyboard.press('Escape');
    }
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Reset leave search filters
   */
  async resetLeaveSearch(): Promise<void> {
    await this.resetButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Get count of leave records
   */
  async getRecordCount(): Promise<number> {
    return readRecordCount(this.page);
  }

  /**
   * Assert Assign Leave page is loaded
   */
  async expectAssignLeaveLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*leave\/assignLeave/);
    await expect(this.assignButton).toBeVisible({ timeout: 15000 });
  }

  /**
   * Check if no records message is visible
   */
  async isNoRecordsVisible(): Promise<boolean> {
    return this.noRecordsFound.isVisible().catch(() => false);
  }
}
