import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * MaintenancePage - Page Object Model for OrangeHRM Maintenance Module
 * URL: /web/index.php/maintenance/purgeEmployee
 * NOTE: This module requires administrator password confirmation before access.
 */
export class MaintenancePage extends BasePage {
  // Admin Access modal
  readonly adminAccessModal: Locator;
  readonly adminPasswordInput: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly passwordRequiredError: Locator;

  // Purge Employee Records
  readonly purgeEmployeeNameInput: Locator;
  readonly purgeSearchButton: Locator;

  // Page header
  readonly maintenanceHeader: Locator;

  constructor(page: Page) {
    super(page);

    // Admin Access modal
    this.adminAccessModal = page.locator('.orangehrm-card-container, .oxd-form');
    this.adminPasswordInput = page.locator('input[type="password"]');
    this.confirmButton = page.locator('button[type="submit"]:has-text("Confirm")');
    this.cancelButton = page.locator('button[type="button"]:has-text("Cancel")');
    this.passwordRequiredError = page.locator('.oxd-input-field-error-message');

    // Purge Employee Records
    this.purgeEmployeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee")) input'
    ).first();
    this.purgeSearchButton = page.locator('button[type="submit"]:has-text("Search")');

    // Page header
    this.maintenanceHeader = page.locator('.oxd-topbar-header-breadcrumb h6').first();
  }

  /**
   * Navigate to Maintenance module
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/maintenance/purgeEmployee');
  }

  /**
   * Assert the admin access prompt is displayed
   */
  async expectAdminAccessPrompt(): Promise<void> {
    await expect(this.adminPasswordInput).toBeVisible({ timeout: 15000 });
    await expect(this.confirmButton).toBeVisible({ timeout: 10000 });
  }

  /**
   * Submit admin password to gain access
   */
  async confirmAdminAccess(password: string): Promise<void> {
    await this.adminPasswordInput.fill(password);
    await this.confirmButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Click cancel on admin access prompt
   */
  async cancelAdminAccess(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Assert Maintenance page loaded (after admin access)
   */
  async expectMaintenancePageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*maintenance/, { timeout: 15000 });
  }

  /**
   * Submit empty password to trigger validation
   */
  async submitEmptyPassword(): Promise<void> {
    await this.adminPasswordInput.clear();
    await this.confirmButton.click();
  }
}
