import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectDropdownOption, readRecordCount } from '../utils/helpers';

/**
 * RecruitmentPage - Page Object Model for OrangeHRM Recruitment Module
 * URL: /web/index.php/recruitment/viewCandidates
 */
export class RecruitmentPage extends BasePage {
  // Search form elements
  readonly vacancyDropdown: Locator;
  readonly candidateNameInput: Locator;
  readonly keywordsInput: Locator;
  readonly hiringManagerInput: Locator;
  readonly statusDropdown: Locator;
  readonly dateFromInput: Locator;
  readonly dateToInput: Locator;
  readonly methodOfApplicationDropdown: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Candidates table
  readonly candidateTable: Locator;
  readonly tableRows: Locator;
  readonly noRecordsFound: Locator;
  readonly recordsCount: Locator;

  // Top bar tabs
  readonly candidatesTab: Locator;
  readonly vacanciesTab: Locator;

  // Action buttons
  readonly addCandidateButton: Locator;

  // Add Candidate form
  readonly addFirstNameInput: Locator;
  readonly addMiddleNameInput: Locator;
  readonly addLastNameInput: Locator;
  readonly addVacancyDropdown: Locator;
  readonly addEmailInput: Locator;
  readonly addContactInput: Locator;
  readonly addNotesInput: Locator;
  readonly addConsentCheckbox: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);

    // Search form
    this.vacancyDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Vacancy")) .oxd-select-text'
    );
    this.candidateNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Candidate Name")) input'
    ).first();
    this.keywordsInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Keywords")) input'
    );
    this.hiringManagerInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Hiring Manager")) input'
    ).first();
    this.statusDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Status")) .oxd-select-text'
    );
    this.dateFromInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Date of Application")) input'
    ).first();
    this.dateToInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Date of Application")) input'
    ).last();
    this.methodOfApplicationDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Method of Application")) .oxd-select-text'
    );
    this.searchButton = page.locator('button[type="submit"]').first();
    this.resetButton = page.locator('button:has-text("Reset")');

    // Candidates table
    this.candidateTable = page.locator('.oxd-table');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.noRecordsFound = page.locator('.oxd-text:has-text("No Records Found")');
    this.recordsCount = page.locator('.orangehrm-horizontal-padding .oxd-text:has-text("Record")').first();

    // Top bar tabs
    this.candidatesTab = page.locator('.oxd-topbar-body-nav-tab:has-text("Candidates")').first();
    this.vacanciesTab = page.locator('.oxd-topbar-body-nav-tab:has-text("Vacancies")').first();

    // Action buttons
    this.addCandidateButton = page.locator('button:has-text("Add")');

    // Add Candidate form
    this.addFirstNameInput = page.locator('input[name="firstName"]');
    this.addMiddleNameInput = page.locator('input[name="middleName"]');
    this.addLastNameInput = page.locator('input[name="lastName"]');
    this.addVacancyDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Vacancy")) .oxd-select-text'
    );
    this.addEmailInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Email")) input'
    );
    this.addContactInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Contact Number")) input'
    );
    this.addNotesInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Notes")) textarea'
    );
    this.addConsentCheckbox = page.locator('.oxd-checkbox-input').first();
    this.saveButton = page.locator('button[type="submit"]:has-text("Save")');
    this.cancelButton = page.locator('button[type="button"]:has-text("Cancel")');
  }

  /**
   * Navigate to Recruitment Candidates page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/recruitment/viewCandidates');
  }

  /**
   * Navigate to Vacancies page
   */
  async gotoVacancies(): Promise<void> {
    await this.navigateTo('/web/index.php/recruitment/viewJobVacancy');
  }

  /**
   * Assert Recruitment page is loaded
   */
  async expectRecruitmentPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*recruitment/, { timeout: 15000 });
    await expect(this.searchButton).toBeVisible({ timeout: 15000 });
  }

  /**
   * Click Vacancies tab
   */
  async clickVacanciesTab(): Promise<void> {
    await this.vacanciesTab.click();
    await this.waitForPageLoad();
  }

  /**
   * Search candidates by status
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

  /**
   * Click Add Candidate
   */
  async clickAddCandidate(): Promise<void> {
    await this.addCandidateButton.click();
    await this.page.waitForURL('**/recruitment/addCandidate', { timeout: 10000 });
    await this.waitForPageLoad();
  }
}
