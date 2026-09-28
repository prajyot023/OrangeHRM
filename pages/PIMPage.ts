import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForSpinnerToDisappear, selectDropdownOption, fillAutocomplete, readRecordCount, generateEmployeeId } from '../utils/helpers';

/**
 * PIMPage - Page Object Model for OrangeHRM PIM (Personnel Information Management) Module
 * URL: /web/index.php/pim/viewEmployeeList
 */
export class PIMPage extends BasePage {
  // Search/Filter form elements
  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly employmentStatusDropdown: Locator;
  readonly includePastEmployeesDropdown: Locator;
  readonly supervisorNameInput: Locator;
  readonly jobTitleDropdown: Locator;
  readonly subUnitDropdown: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Employee list table
  readonly employeeTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;
  readonly noRecordsFound: Locator;
  readonly recordsCount: Locator;

  // Action buttons
  readonly addEmployeeButton: Locator;
  readonly deleteSelectedButton: Locator;

  // Add Employee form elements
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdField: Locator;
  readonly saveButton: Locator;
  readonly createLoginToggle: Locator;
  readonly loginUsernameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginConfirmPasswordInput: Locator;

  // Table action buttons (per row)
  readonly editButtons: Locator;
  readonly deleteButtons: Locator;

  // Delete confirmation dialog
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;

  constructor(page: Page) {
    super(page);

    // Search form
    this.employeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    ).first();
    this.employeeIdInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Id")) input'
    );
    this.employmentStatusDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employment Status")) .oxd-select-text'
    );
    this.includePastEmployeesDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Include")) .oxd-select-text'
    );
    this.supervisorNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Supervisor Name")) input'
    ).first();
    this.jobTitleDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Job Title")) .oxd-select-text'
    );
    this.subUnitDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Sub Unit")) .oxd-select-text'
    );
    this.searchButton = page.locator('button[type="submit"]').first();
    this.resetButton = page.locator('button:has-text("Reset")');

    // Employee table
    this.employeeTable = page.locator('.oxd-table');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.tableHeaders = page.locator('.oxd-table-header-cell');
    this.noRecordsFound = page.locator('.oxd-text:has-text("No Records Found")');
    this.recordsCount = page.locator('.orangehrm-horizontal-padding .oxd-text:has-text("Record")');

    // Action buttons
    this.addEmployeeButton = page.locator('button:has-text("Add")');
    this.deleteSelectedButton = page.locator('button:has-text("Delete Selected")');

    // Add Employee form
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdField = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Id")) input'
    );
    this.saveButton = page.locator('button[type="submit"]:has-text("Save")');
    this.createLoginToggle = page.locator('.oxd-switch-input');
    this.loginUsernameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Username")) input'
    );
    this.loginPasswordInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Password")) input'
    );
    this.loginConfirmPasswordInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Confirm Password")) input'
    );

    // Table actions
    this.editButtons = page.locator('.oxd-table-body .oxd-icon.bi-pencil-fill');
    this.deleteButtons = page.locator('.oxd-table-body .oxd-icon.bi-trash');

    // Delete dialog
    this.confirmDeleteButton = page.locator('.orangehrm-modal-footer button:has-text("Yes, Delete")');
    this.cancelDeleteButton = page.locator('.orangehrm-modal-footer button:has-text("No, Cancel")');
  }

  /**
   * Navigate to PIM employee list page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/pim/viewEmployeeList');
  }

  /**
   * Navigate to Add Employee page
   */
  async gotoAddEmployee(): Promise<void> {
    await this.navigateTo('/web/index.php/pim/addEmployee');
  }

  /**
   * Assert PIM list page is loaded
   */
  async expectPIMPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*pim\/viewEmployeeList/);
    // The <table> is in the DOM before its contents are: the rows *and* the
    // header row are rendered from the employee-list XHR, which on the shared
    // demo regularly lands several seconds after the table itself is visible.
    // Waiting on the table alone let callers read an empty grid.
    await expect(this.employeeTable).toBeVisible({ timeout: 15000 });
    await expect(this.tableHeaders.first()).toBeVisible({ timeout: 30000 });
  }

  /**
   * Search employees by name
   */
  async searchByEmployeeName(name: string): Promise<void> {
    await fillAutocomplete(
      this.page,
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input',
      name
    );
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Search employees by Employee ID
   */
  async searchByEmployeeId(id: string): Promise<void> {
    await this.employeeIdInput.fill(id);
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Reset the search filters
   */
  async resetSearch(): Promise<void> {
    await this.resetButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Get the number of records shown in the table
   */
  async getRecordCount(): Promise<number> {
    return readRecordCount(this.page);
  }

  /**
   * Get all employee names from the table
   */
  async getEmployeeNames(): Promise<string[]> {
    const rows = this.tableRows;
    const count = await rows.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('.oxd-table-cell');
      const firstName = (await cells.nth(2).textContent()) || '';
      const lastName = (await cells.nth(3).textContent()) || '';
      names.push(`${firstName.trim()} ${lastName.trim()}`);
    }
    return names;
  }

  /**
   * Click the Add Employee button
   */
  async clickAddEmployee(): Promise<void> {
    await this.addEmployeeButton.click();
    await this.page.waitForURL('**/pim/addEmployee', { timeout: 10000 });
    await this.waitForPageLoad();
  }

  /**
   * Add a new employee with basic details
   */
  async addEmployee(firstName: string, middleName: string, lastName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    // Replace the pre-filled sequential id -- on the shared demo it is often
    // already taken by the time we save. See generateEmployeeId.
    await this.employeeIdField.fill(generateEmployeeId());
    await this.settleEmployeeIdValidation();
    await this.saveButton.click();
    // Saving takes roughly 10s to POST and another 10s to route to the new
    // employee's page on the demo. Wait for that landing here so callers are
    // asserting an outcome rather than racing it.
    await this.page.waitForURL(/pim\/viewPersonalDetails/, {
      timeout: 60000,
      waitUntil: 'domcontentloaded',
    });
    await this.waitForPageLoad();
  }

  /**
   * Let the Employee Id field's async uniqueness check finish.
   *
   * Blurring the field fires a GET against the employee list, and a Save
   * clicked while that check is still in flight is silently swallowed -- the
   * form never POSTs, shows no error, and just sits on the Add Employee page.
   */
  private async settleEmployeeIdValidation(): Promise<void> {
    const validated = this.page
      .waitForResponse(
        (response) =>
          response.url().includes('/api/v2/pim/employees') &&
          response.request().method() === 'GET',
        { timeout: 15000 }
      )
      .catch(() => undefined);
    await this.employeeIdField.blur();
    await validated;
  }

  /**
   * Add employee with login details enabled
   */
  async addEmployeeWithLogin(
    firstName: string,
    middleName: string,
    lastName: string,
    username: string,
    password: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdField.fill(generateEmployeeId());
    await this.settleEmployeeIdValidation();

    // Toggle create login
    await this.createLoginToggle.click();
    await this.loginUsernameInput.fill(username);
    await this.loginPasswordInput.fill(password);
    await this.loginConfirmPasswordInput.fill(password);

    await this.saveButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Get the auto-generated employee ID from the add form
   */
  async getAutoGeneratedEmployeeId(): Promise<string> {
    return (await this.employeeIdField.inputValue()) || '';
  }

  /**
   * Edit the first employee in the table
   */
  async editFirstEmployee(): Promise<void> {
    await this.editButtons.first().click();
    await this.waitForPageLoad();
  }

  /**
   * Delete the first employee in the table
   */
  async deleteFirstEmployee(): Promise<void> {
    await this.deleteButtons.first().click();
    await this.confirmDeleteButton.waitFor({ state: 'visible' });
    await this.confirmDeleteButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Select a checkbox for a specific table row
   */
  async selectTableRow(rowIndex: number): Promise<void> {
    const checkbox = this.tableRows
      .nth(rowIndex)
      .locator('.oxd-checkbox-input');
    await checkbox.click();
  }

  /**
   * Assert Add Employee form is loaded
   */
  async expectAddEmployeeFormLoaded(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }
}
