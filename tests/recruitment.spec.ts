import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * Recruitment Module - End-to-End Tests
 * Tests for candidates listing, search, vacancies tab, and add candidate flow
 */

test.describe('Recruitment Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-RECRUIT-001: Verify Recruitment page loads', async ({ recruitmentPage }) => {
    await recruitmentPage.goto();
    await recruitmentPage.expectRecruitmentPageLoaded();
  });

  test('TC-RECRUIT-002: Verify search form fields', async ({ recruitmentPage }) => {
    await recruitmentPage.goto();
    await recruitmentPage.expectRecruitmentPageLoaded();

    await expect(recruitmentPage.candidateNameInput).toBeVisible();
    await expect(recruitmentPage.searchButton).toBeVisible();
    await expect(recruitmentPage.resetButton).toBeVisible();
  });

  test('TC-RECRUIT-003: Verify Candidates and Vacancies tabs', async ({ recruitmentPage }) => {
    await recruitmentPage.goto();
    await recruitmentPage.expectRecruitmentPageLoaded();

    await expect(recruitmentPage.candidatesTab).toBeVisible();
    await expect(recruitmentPage.vacanciesTab).toBeVisible();
  });

  test('TC-RECRUIT-004: Navigate to Vacancies tab', async ({ recruitmentPage, page }) => {
    await recruitmentPage.goto();
    await recruitmentPage.expectRecruitmentPageLoaded();

    await recruitmentPage.clickVacanciesTab();
    await expect(page).toHaveURL(/.*recruitment\/viewJobVacancy/, { timeout: 15000 });
  });

  test('TC-RECRUIT-005: Verify candidates table is displayed', async ({ recruitmentPage }) => {
    await recruitmentPage.goto();
    await recruitmentPage.expectRecruitmentPageLoaded();

    await expect(recruitmentPage.candidateTable).toBeVisible({ timeout: 10000 });
  });

  test('TC-RECRUIT-006: Reset search filters', async ({ recruitmentPage }) => {
    await recruitmentPage.goto();
    await recruitmentPage.expectRecruitmentPageLoaded();

    await recruitmentPage.resetSearch();
    // After reset, the form should still be present
    await expect(recruitmentPage.searchButton).toBeVisible();
  });

  test('TC-RECRUIT-007: Navigate to Add Candidate page', async ({ recruitmentPage, page }) => {
    await recruitmentPage.goto();
    await recruitmentPage.expectRecruitmentPageLoaded();

    await recruitmentPage.clickAddCandidate();
    await expect(page).toHaveURL(/.*recruitment\/addCandidate/, { timeout: 15000 });
  });

  test('TC-RECRUIT-008: Verify Add Candidate form fields', async ({ recruitmentPage }) => {
    await recruitmentPage.goto();
    await recruitmentPage.clickAddCandidate();

    await expect(recruitmentPage.addFirstNameInput).toBeVisible();
    await expect(recruitmentPage.addLastNameInput).toBeVisible();
    await expect(recruitmentPage.addEmailInput).toBeVisible();
    await expect(recruitmentPage.saveButton).toBeVisible();
    await expect(recruitmentPage.cancelButton).toBeVisible();
  });

  test('TC-RECRUIT-009: Cancel Add Candidate returns to candidates list', async ({ recruitmentPage, page }) => {
    await recruitmentPage.goto();
    await recruitmentPage.clickAddCandidate();
    await recruitmentPage.cancelButton.click();

    await expect(page).toHaveURL(/.*recruitment\/viewCandidates/, { timeout: 15000 });
  });

  test('TC-RECRUIT-010: Navigate to Vacancies directly', async ({ recruitmentPage, page }) => {
    await recruitmentPage.gotoVacancies();
    await expect(page).toHaveURL(/.*recruitment\/viewJobVacancy/, { timeout: 15000 });
  });
});
