import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PIMPage } from '../pages/PIMPage';
import { LeavePage } from '../pages/LeavePage';
import { DirectoryPage } from '../pages/DirectoryPage';
import { MyInfoPage } from '../pages/MyInfoPage';
import { AdminPage } from '../pages/AdminPage';
import { BuzzPage } from '../pages/BuzzPage';
import { TimePage } from '../pages/TimePage';
import { RecruitmentPage } from '../pages/RecruitmentPage';
import { PerformancePage } from '../pages/PerformancePage';
import { ClaimPage } from '../pages/ClaimPage';
import { MaintenancePage } from '../pages/MaintenancePage';
import { Credentials } from '../utils/testData';

/**
 * Custom Playwright fixtures for OrangeHRM Page Objects
 * Provides pre-instantiated page objects to all tests
 */

// Define custom fixture types
type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PIMPage;
  leavePage: LeavePage;
  directoryPage: DirectoryPage;
  myInfoPage: MyInfoPage;
  adminPage: AdminPage;
  buzzPage: BuzzPage;
  timePage: TimePage;
  recruitmentPage: RecruitmentPage;
  performancePage: PerformancePage;
  claimPage: ClaimPage;
  maintenancePage: MaintenancePage;
  authenticatedPage: DashboardPage; // Pre-authenticated session
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  pimPage: async ({ page }, use) => {
    const pimPage = new PIMPage(page);
    await use(pimPage);
  },

  leavePage: async ({ page }, use) => {
    const leavePage = new LeavePage(page);
    await use(leavePage);
  },

  directoryPage: async ({ page }, use) => {
    const directoryPage = new DirectoryPage(page);
    await use(directoryPage);
  },

  myInfoPage: async ({ page }, use) => {
    const myInfoPage = new MyInfoPage(page);
    await use(myInfoPage);
  },

  adminPage: async ({ page }, use) => {
    const adminPage = new AdminPage(page);
    await use(adminPage);
  },

  buzzPage: async ({ page }, use) => {
    const buzzPage = new BuzzPage(page);
    await use(buzzPage);
  },

  timePage: async ({ page }, use) => {
    const timePage = new TimePage(page);
    await use(timePage);
  },

  recruitmentPage: async ({ page }, use) => {
    const recruitmentPage = new RecruitmentPage(page);
    await use(recruitmentPage);
  },

  performancePage: async ({ page }, use) => {
    const performancePage = new PerformancePage(page);
    await use(performancePage);
  },

  claimPage: async ({ page }, use) => {
    const claimPage = new ClaimPage(page);
    await use(claimPage);
  },

  maintenancePage: async ({ page }, use) => {
    const maintenancePage = new MaintenancePage(page);
    await use(maintenancePage);
  },

  /**
   * Pre-authenticated page fixture
   * Automatically logs in before the test and provides a DashboardPage
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
