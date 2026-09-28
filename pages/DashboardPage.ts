import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage - Page Object Model for OrangeHRM Dashboard
 * URL: /web/index.php/dashboard/index
 */
export class DashboardPage extends BasePage {
  // Dashboard-specific elements
  readonly dashboardGrid: Locator;
  readonly timeAtWorkWidget: Locator;
  readonly myActionsWidget: Locator;
  readonly quickLaunchWidget: Locator;
  readonly buzzFeedWidget: Locator;
  readonly employeeDistributionWidget: Locator;
  readonly legendItems: Locator;

  // Quick Launch shortcuts
  readonly assignLeaveShortcut: Locator;
  readonly leaveListShortcut: Locator;
  readonly timesheetsShortcut: Locator;
  readonly applyLeaveShortcut: Locator;
  readonly myLeaveShortcut: Locator;
  readonly myTimesheetShortcut: Locator;

  constructor(page: Page) {
    super(page);

    // Dashboard widgets — use .first() to avoid strict mode violations when
    // OrangeHRM renders nested containers that both match the same :has-text() query.
    this.dashboardGrid = page.locator('.orangehrm-dashboard-grid');
    this.timeAtWorkWidget = page.locator('.oxd-grid-item:has(.oxd-text:text("Time at Work"))').first();
    this.myActionsWidget = page.locator('.oxd-grid-item:has(.oxd-text:text("My Actions"))').first();
    this.quickLaunchWidget = page.locator('.oxd-grid-item:has(.oxd-text:text("Quick Launch"))').first();
    this.buzzFeedWidget = page.locator('.oxd-grid-item:has(.oxd-text:text("Buzz Latest Posts"))').first();
    this.employeeDistributionWidget = page.locator(
      '.oxd-grid-item:has(.oxd-text:text("Employee Distribution"))'
    ).first();
    this.legendItems = page.locator('.oxd-chart-legend-item');

    // Quick Launch links
    this.assignLeaveShortcut = page.locator(
      'button:has(.orangehrm-quick-launch-heading:text("Assign Leave"))'
    ).first();
    this.leaveListShortcut = page.locator(
      'button:has(.orangehrm-quick-launch-heading:text("Leave List"))'
    ).first();
    this.timesheetsShortcut = page.locator(
      'button:has(.orangehrm-quick-launch-heading:text("Timesheets"))'
    ).first();
    this.applyLeaveShortcut = page.locator(
      'button:has(.orangehrm-quick-launch-heading:text("Apply Leave"))'
    ).first();
    this.myLeaveShortcut = page.locator(
      'button:has(.orangehrm-quick-launch-heading:text("My Leave"))'
    ).first();
    this.myTimesheetShortcut = page.locator(
      'button:has(.orangehrm-quick-launch-heading:text("My Timesheet"))'
    ).first();
  }

  /**
   * Navigate to the dashboard page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/dashboard/index');
  }

  /**
   * Assert dashboard is loaded
   */
  async expectDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*dashboard\/index/);
    await expect(this.dashboardGrid).toBeVisible();
  }

  /**
   * Assert key widgets are displayed
   */
  async expectWidgetsVisible(): Promise<void> {
    await expect(this.timeAtWorkWidget).toBeVisible();
    await expect(this.quickLaunchWidget).toBeVisible();
  }

  /**
   * Get count of visible widgets on dashboard
   */
  async getWidgetCount(): Promise<number> {
    const widgets = this.page.locator('.oxd-grid-item .oxd-sheet--rounded');
    const count = await widgets.count();
    // Fallback: if the above selector returns 0, try broader selector
    if (count === 0) {
      return this.page.locator('.orangehrm-dashboard-grid .oxd-grid-item').count();
    }
    return count;
  }

  /**
   * Click a quick launch shortcut
   */
  async clickQuickLaunch(shortcutName: string): Promise<void> {
    const shortcut = this.page.locator(
      `.quick-launch-links button:has-text("${shortcutName}")`
    );
    await shortcut.click();
    await this.waitForPageLoad();
  }

  /**
   * Get the dashboard page title
   */
  async getDashboardTitle(): Promise<string> {
    const title = this.topbarHeader.locator('h6').first();
    await title.waitFor({ state: 'visible', timeout: 15000 });
    return (await title.textContent()) || '';
  }
}
