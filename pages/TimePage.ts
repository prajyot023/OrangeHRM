import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * TimePage - Page Object Model for OrangeHRM Time Module
 * URL: /web/index.php/time/viewEmployeeTimesheet
 */
export class TimePage extends BasePage {
  // Employee Timesheet form
  readonly employeeNameInput: Locator;
  readonly viewButton: Locator;

  // Timesheet table
  readonly timesheetTable: Locator;

  // Top bar navigation tabs
  readonly timesheetsTab: Locator;
  readonly attendanceTab: Locator;
  readonly reportsTab: Locator;
  readonly projectInfoTab: Locator;

  // Timesheet sub-tabs
  readonly myTimesheetTab: Locator;
  readonly employeeTimesheetTab: Locator;

  // Attendance sub-tabs
  readonly myRecordsTab: Locator;
  readonly punchInOutTab: Locator;
  readonly employeeRecordsTab: Locator;
  readonly configurationTab: Locator;

  // Reports sub-tabs
  readonly projectReportsTab: Locator;
  readonly employeeReportsTab: Locator;
  readonly attendanceSummaryTab: Locator;

  // Project Info sub-tabs
  readonly customersTab: Locator;
  readonly projectsTab: Locator;

  constructor(page: Page) {
    super(page);

    // Employee Timesheet form
    this.employeeNameInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    ).first();
    this.viewButton = page.locator('button[type="submit"]').first();

    // Timesheet table
    this.timesheetTable = page.locator('.oxd-table, .orangehrm-timesheet-table');

    // Top bar tabs
    this.timesheetsTab = page.locator('.oxd-topbar-body-nav-tab:has-text("Timesheets")').first();
    this.attendanceTab = page.locator('.oxd-topbar-body-nav-tab:has-text("Attendance")').first();
    this.reportsTab = page.locator('.oxd-topbar-body-nav-tab:has-text("Reports")').first();
    this.projectInfoTab = page.locator('.oxd-topbar-body-nav-tab:has-text("Project Info")').first();

    // Timesheet sub-tabs
    this.myTimesheetTab = page.locator('a:has-text("My Timesheets")').first();
    this.employeeTimesheetTab = page.locator('a:has-text("Employee Timesheets")').first();

    // Attendance sub-tabs
    this.myRecordsTab = page.locator('a:has-text("My Records")').first();
    this.punchInOutTab = page.locator('a:has-text("Punch In/Out")').first();
    this.employeeRecordsTab = page.locator('a:has-text("Employee Records")').first();
    this.configurationTab = page.locator('a:has-text("Configuration")').first();

    // Reports sub-tabs
    this.projectReportsTab = page.locator('a:has-text("Project Reports")').first();
    this.employeeReportsTab = page.locator('a:has-text("Employee Reports")').first();
    this.attendanceSummaryTab = page.locator('a:has-text("Attendance Summary")').first();

    // Project Info sub-tabs
    this.customersTab = page.locator('a:has-text("Customers")').first();
    this.projectsTab = page.locator('a:has-text("Projects")').first();
  }

  /**
   * Navigate to Time module (Employee Timesheets)
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/time/viewEmployeeTimesheet');
  }

  /**
   * Navigate to My Timesheet
   */
  async gotoMyTimesheet(): Promise<void> {
    await this.navigateTo('/web/index.php/time/viewMyTimesheet');
  }

  /**
   * Navigate to Attendance My Records
   */
  async gotoMyRecords(): Promise<void> {
    await this.navigateTo('/web/index.php/attendance/viewMyAttendanceRecord');
  }

  /**
   * Navigate to Punch In/Out
   */
  async gotoPunchInOut(): Promise<void> {
    await this.navigateTo('/web/index.php/attendance/punchIn');
  }

  /**
   * Assert Time module page is loaded
   */
  async expectTimePageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*time/, { timeout: 15000 });
    await expect(this.viewButton).toBeVisible({ timeout: 15000 });
  }

  /**
   * Assert top bar tabs are visible
   */
  async expectTopBarTabsVisible(): Promise<void> {
    await expect(this.timesheetsTab).toBeVisible({ timeout: 10000 });
    await expect(this.attendanceTab).toBeVisible({ timeout: 10000 });
  }

  /**
   * Click Timesheets top tab and open sub-menu
   */
  async clickTimesheetsTab(): Promise<void> {
    await this.timesheetsTab.click();
  }

  /**
   * Click Attendance top tab and open sub-menu
   */
  async clickAttendanceTab(): Promise<void> {
    await this.attendanceTab.click();
  }

  /**
   * Navigate to My Timesheets via sub-menu
   */
  async navigateToMyTimesheets(): Promise<void> {
    await this.clickTimesheetsTab();
    await this.myTimesheetTab.waitFor({ state: 'visible', timeout: 5000 });
    await this.myTimesheetTab.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Attendance > My Records via sub-menu
   */
  async navigateToMyRecords(): Promise<void> {
    await this.clickAttendanceTab();
    await this.myRecordsTab.waitFor({ state: 'visible', timeout: 5000 });
    await this.myRecordsTab.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Attendance > Punch In/Out via sub-menu
   */
  async navigateToPunchInOut(): Promise<void> {
    await this.clickAttendanceTab();
    await this.punchInOutTab.waitFor({ state: 'visible', timeout: 5000 });
    await this.punchInOutTab.click();
    await this.waitForPageLoad();
  }
}
