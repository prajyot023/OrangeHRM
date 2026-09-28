import { Page, Locator, expect } from '@playwright/test';
import { waitForSpinnerToDisappear } from '../utils/helpers';

/**
 * BasePage - Abstract base class for all page objects
 * Contains shared methods and common element interactions
 */
export class BasePage {
  readonly page: Page;

  // Common elements across all pages
  readonly sidebarMenu: Locator;
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;
  readonly topbarHeader: Locator;
  readonly searchSidebar: Locator;
  readonly toastMessage: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    // Narrowed to the <ul>: a wrapper <div> carries the same class, so the bare
    // class selector is ambiguous and any waitFor on it hits strict mode.
    this.sidebarMenu = page.locator('.oxd-sidepanel-body ul.oxd-main-menu');
    this.userDropdown = page.locator('.oxd-userdropdown');
    this.logoutLink = page.locator('a[role="menuitem"]:has-text("Logout")');
    this.topbarHeader = page.locator('.oxd-topbar-header-breadcrumb');
    this.searchSidebar = page.locator('.oxd-main-menu-search input');
    this.toastMessage = page.locator('.oxd-toast');
    this.loadingSpinner = page.locator('.oxd-loading-spinner');
  }

  /**
   * Navigate to a specific URL path
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Click a sidebar menu item by name
   */
  async clickSidebarMenu(menuName: string): Promise<void> {
    const menuItem = this.page.locator(
      `.oxd-main-menu-item:has(.oxd-text:text("${menuName}"))`
    );
    await menuItem.click();
    await this.waitForPageLoad();
  }

  /**
   * Search for a menu item in sidebar and click it
   */
  async searchAndClickSidebarMenu(menuName: string): Promise<void> {
    await this.searchSidebar.fill(menuName);
    await this.page.waitForTimeout(500);
    await this.clickSidebarMenu(menuName);
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutLink.click();
    await this.page.waitForURL('**/auth/login', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get the current page header/title text
   */
  async getPageTitle(): Promise<string> {
    const header = this.topbarHeader.locator('h6').first();
    return (await header.textContent()) || '';
  }

  /**
   * Wait for a toast notification and return its text
   */
  async getToastMessage(): Promise<string> {
    await this.toastMessage.first().waitFor({ state: 'visible', timeout: 10000 });
    const text = (await this.toastMessage.first().textContent()) || '';
    return text;
  }

  /**
   * Assert a toast success message appeared
   */
  async expectToastSuccess(): Promise<void> {
    const toast = this.page.locator('.oxd-toast--success');
    await expect(toast).toBeVisible({ timeout: 10000 });
  }

  /**
   * Assert a toast error message appeared
   */
  async expectToastError(): Promise<void> {
    const toast = this.page.locator('.oxd-toast--error');
    await expect(toast).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get the logged-in user's display name
   */
  async getLoggedInUserName(): Promise<string> {
    const userName = this.userDropdown.locator('.oxd-userdropdown-tab p');
    return (await userName.textContent()) || '';
  }

  /**
   * Check if sidebar menu item is visible
   */
  async isSidebarMenuItemVisible(menuName: string): Promise<boolean> {
    const menuItem = this.page.locator(
      `.oxd-main-menu-item:has(.oxd-text:text("${menuName}"))`
    );
    return menuItem.isVisible();
  }

  /**
   * Get all visible sidebar menu items
   */
  async getSidebarMenuItems(): Promise<string[]> {
    const items = this.page.locator('.oxd-main-menu-item .oxd-text, .oxd-main-menu-item--name');
    await items.first().waitFor({ state: 'visible', timeout: 10000 });
    const texts = await items.allTextContents();
    return texts.filter((t) => t.trim().length > 0);
  }

  /**
   * Wait for page to be fully loaded (spinner gone + network idle)
   */
  async waitForPageLoad(): Promise<void> {
    // 'domcontentloaded' + shell + spinner, not 'networkidle': the OrangeHRM demo
    // holds background requests open, so networkidle can hang until the nav timeout.
    await this.page.waitForLoadState('domcontentloaded');
    // domcontentloaded fires before Vue has mounted anything, and the spinner
    // check below is a no-op while the spinner has yet to appear -- so without
    // this the method returned on a blank page and callers raced the render,
    // looking for topbar tabs and form fields that were not there yet.
    await this.sidebarMenu.waitFor({ state: 'visible', timeout: 30000 });
    await waitForSpinnerToDisappear(this.page);
  }
}
