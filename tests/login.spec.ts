import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';

/**
 * Login Module - End-to-End Tests
 * Tests for login functionality, validations, and forgot password flow
 */

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-LOGIN-001: Verify login page loads correctly', async ({ loginPage }) => {
    await loginPage.expectLoginPageLoaded();

    // Verify placeholder text
    const usernamePlaceholder = await loginPage.getUsernamePlaceholder();
    const passwordPlaceholder = await loginPage.getPasswordPlaceholder();
    expect(usernamePlaceholder).toBe('Username');
    expect(passwordPlaceholder).toBe('Password');
  });

  test('TC-LOGIN-002: Login with valid credentials', async ({ loginPage, page }) => {
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard\/index/);
  });

  test('TC-LOGIN-003: Login with invalid credentials', async ({ loginPage }) => {
    await loginPage.login(
      Credentials.INVALID.username,
      Credentials.INVALID.password
    );

    // Verify error message
    await loginPage.expectInvalidCredentialsError();
  });

  test('TC-LOGIN-004: Login with empty credentials', async ({ loginPage }) => {
    await loginPage.loginButton.click();

    // Verify required field validation errors
    await loginPage.expectRequiredFieldErrors();
  });

  test('TC-LOGIN-005: Login with valid username and invalid password', async ({ loginPage }) => {
    await loginPage.login(
      Credentials.ADMIN.username,
      'wrongPassword123'
    );

    await loginPage.expectInvalidCredentialsError();
  });

  test('TC-LOGIN-006: Login with invalid username and valid password', async ({ loginPage }) => {
    await loginPage.login(
      'InvalidAdmin',
      Credentials.ADMIN.password
    );

    await loginPage.expectInvalidCredentialsError();
  });

  test('TC-LOGIN-007: Verify Forgot Password link navigation', async ({ loginPage, page }) => {
    await loginPage.clickForgotPassword();

    // Verify navigated to forgot password page
    await expect(page).toHaveURL(/.*requestPasswordResetCode/);
  });

  test('TC-LOGIN-008: Cancel Forgot Password returns to login', async ({ loginPage, page }) => {
    await loginPage.clickForgotPassword();
    await loginPage.cancelForgotPassword();

    // Verify returned to login page
    await expect(page).toHaveURL(/.*auth\/login/);
    await loginPage.expectLoginPageLoaded();
  });

  // SKIPPED: the public OrangeHRM demo cannot complete a password reset. Submitting
  // this form POSTs to /auth/requestResetPassword, which hangs ~60s and then returns
  // 504 Gateway Time-out (verified repeatedly, 2026-09-13). There is no success page
  // to assert on, so this cannot pass against the demo environment regardless of the
  // wait strategy used. TC-LOGIN-011 covers the part of the form that is testable.
  // Re-enable this when running against an instance with a working mail/reset backend.
  test.skip('TC-LOGIN-009: Submit Forgot Password with valid username', async ({ loginPage, page }) => {
    await loginPage.clickForgotPassword();
    await loginPage.submitForgotPassword(Credentials.ADMIN.username);

    await expect(page).not.toHaveURL(/.*requestPasswordResetCode/);
  });

  test('TC-LOGIN-010: Verify logo is displayed on login page', async ({ loginPage }) => {
    await expect(loginPage.brandLogo).toBeVisible();
  });

  test('TC-LOGIN-011: Forgot Password requires a username', async ({ loginPage, page }) => {
    await loginPage.clickForgotPassword();
    await loginPage.expectResetPasswordPageLoaded();

    // Submitting empty is validated client-side, so it never hits the broken
    // reset endpoint exercised by TC-LOGIN-009.
    await loginPage.resetButton.click();

    await loginPage.expectResetUsernameRequiredError();
    await expect(page).toHaveURL(/.*requestPasswordResetCode/);
  });
});
