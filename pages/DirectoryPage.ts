import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectDropdownOption, readRecordCount } from '../utils/helpers';

/**
 * DirectoryPage - Page Object Model for OrangeHRM Directory Module
 * URL: /web/index.php/directory/viewDirectory
 */
export class DirectoryPage extends BasePage {
  // Search/Filter elements
  readonly employeeNameInput: Locator;
  readonly jobTitleDropdown: Locator;
  readonly locationDropdown: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Directory cards
  readonly directoryCards: Locator;
  readonly noRecordsFound: Locator;
  readonly recordsCount: Locator;

  constructor(page: Page) {
    super(page);

    // Search form
    this.employeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    ).first();
    this.jobTitleDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Job Title")) .oxd-select-text'
    );
    this.locationDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Location")) .oxd-select-text'
    );
    this.searchButton = page.locator('button[type="submit"]').first();
    this.resetButton = page.locator('button:has-text("Reset")');

    // Directory cards/results
    this.directoryCards = page.locator('.orangehrm-directory-card');
    this.noRecordsFound = page.locator('.oxd-text:has-text("No Records Found")');
    this.recordsCount = page.locator('.orangehrm-horizontal-padding .oxd-text:has-text("Record")');
  }

  /**
   * Navigate to Directory page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/directory/viewDirectory');
  }

  /**
   * Assert Directory page is loaded
   */
  async expectDirectoryPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*directory\/viewDirectory/);
    await expect(this.searchButton).toBeVisible({ timeout: 15000 });
  }

  /**
   * Search directory by employee name
   */
  async searchByName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    await this.page.waitForTimeout(1000);
    const autocomplete = this.page.locator('.oxd-autocomplete-option');
    if ((await autocomplete.count()) > 0) {
      await autocomplete.first().click();
    }
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Search directory by Job Title dropdown
   */
  async searchByJobTitle(jobTitle: string): Promise<void> {
    await selectDropdownOption(
      this.page,
      '.oxd-input-group:has(.oxd-label:text("Job Title")) .oxd-select-text',
      jobTitle
    );
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Search directory by Location dropdown
   */
  async searchByLocation(location: string): Promise<void> {
    await selectDropdownOption(
      this.page,
      '.oxd-input-group:has(.oxd-label:text("Location")) .oxd-select-text',
      location
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
   * Get count of directory cards displayed
   */
  async getCardCount(): Promise<number> {
    return this.directoryCards.count();
  }

  /**
   * Get count of records from the counter text
   */
  async getRecordCount(): Promise<number> {
    return readRecordCount(this.page);
  }

  /**
   * Check if no records found message is displayed
   */
  async isNoRecordsVisible(): Promise<boolean> {
    return this.noRecordsFound.isVisible().catch(() => false);
  }

  /**
   * Get all employee names from directory cards
   */
  async getEmployeeNamesFromCards(): Promise<string[]> {
    const cards = this.directoryCards;
    const count = await cards.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await cards.nth(i).locator('.orangehrm-directory-card-header .oxd-text').textContent();
      if (name) names.push(name.trim());
    }
    return names;
  }
}
