import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectDropdownOption, readRecordCount } from '../utils/helpers';

/**
 * AdminPage - Page Object Model for OrangeHRM Admin Module
 * URL: /web/index.php/admin/viewSystemUsers
 */
export class AdminPage extends BasePage {
  // Search/Filter form elements
  readonly usernameInput: Locator;
  readonly userRoleDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly statusDropdown: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // User list table
  readonly userTable: Locator;
  readonly tableRows: Locator;
  readonly noRecordsFound: Locator;
  readonly recordsCount: Locator;

  // Action buttons
  readonly addUserButton: Locator;
  readonly deleteSelectedButton: Locator;

  // Add User form
  readonly addUserRoleDropdown: Locator;
  readonly addEmployeeNameInput: Locator;
  readonly addStatusDropdown: Locator;
  readonly addUsernameInput: Locator;
  readonly addPasswordInput: Locator;
  readonly addConfirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  // Table row actions
  readonly editButtons: Locator;
  readonly deleteButtons: Locator;

  // Delete dialog
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;

  constructor(page: Page) {
    super(page);

    // Search form
    this.usernameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Username")) input'
    );
    this.userRoleDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("User Role")) .oxd-select-text'
    );
    this.employeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    ).first();
    this.statusDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Status")) .oxd-select-text'
    );
    this.searchButton = page.locator('button[type="submit"]').first();
    this.resetButton = page.locator('button:has-text("Reset")');

    // User table
    this.userTable = page.locator('.oxd-table');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.noRecordsFound = page.locator('.oxd-text:has-text("No Records Found")');
    this.recordsCount = page.locator('.orangehrm-horizontal-padding .oxd-text:has-text("Record")');

    // Action buttons
    this.addUserButton = page.locator('button:has-text("Add")');
    this.deleteSelectedButton = page.locator('button:has-text("Delete Selected")');

    // Add User form
    this.addUserRoleDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("User Role")) .oxd-select-text'
    );
    this.addEmployeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    ).first();
    this.addStatusDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Status")) .oxd-select-text'
    );
    this.addUsernameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Username")) input'
    );
    this.addPasswordInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text-is("Password")) input'
    );
    this.addConfirmPasswordInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Confirm Password")) input'
    );
    this.saveButton = page.locator('button[type="submit"]:has-text("Save")');
    this.cancelButton = page.locator('button[type="button"]:has-text("Cancel")');

    // Table actions
    this.editButtons = page.locator('.oxd-table-body .oxd-icon.bi-pencil-fill');
    this.deleteButtons = page.locator('.oxd-table-body .oxd-icon.bi-trash');

    // Delete dialog
    this.confirmDeleteButton = page.locator('.orangehrm-modal-footer button:has-text("Yes, Delete")');
    this.cancelDeleteButton = page.locator('.orangehrm-modal-footer button:has-text("No, Cancel")');
  }

  /**
   * Navigate to Admin System Users page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/admin/viewSystemUsers');
  }

  /**
   * Assert Admin page is loaded
   */
  async expectAdminPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*admin\/viewSystemUsers/);
    await expect(this.userTable).toBeVisible({ timeout: 15000 });
  }

  /**
   * Search user by username
   */
  async searchByUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Search user by role
   */
  async searchByUserRole(role: string): Promise<void> {
    await selectDropdownOption(
      this.page,
      '.oxd-input-group:has(.oxd-label:text("User Role")) .oxd-select-text',
      role
    );
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Search user by status
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
   * Get record count from counter text
   */
  async getRecordCount(): Promise<number> {
    return readRecordCount(this.page);
  }

  /**
   * Click Add button to add new user
   */
  async clickAddUser(): Promise<void> {
    await this.addUserButton.click();
    await this.page.waitForURL('**/admin/saveSystemUser', { timeout: 10000 });
    await this.waitForPageLoad();
  }
}
