import { Page, Locator, expect } from '@playwright/test';

/**
 * LoginPage - Page Object Model for OrangeHRM Login Page
 * URL: /web/index.php/auth/login
 */
export class LoginPage {
  readonly page: Page;

  // Login form elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;

  // Branding elements
  readonly brandLogo: Locator;
  readonly loginTitle: Locator;

  // Error/Validation elements
  readonly errorAlert: Locator;
  readonly usernameRequiredError: Locator;
  readonly passwordRequiredError: Locator;

  // Forgot Password Page elements
  readonly forgotPasswordTitle: Locator;
  readonly resetUsernameInput: Locator;
  readonly resetButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot p');

    // Branding
    this.brandLogo = page.locator('.orangehrm-login-branding img');
    this.loginTitle = page.locator('.orangehrm-login-title, .oxd-text--h5');

    // Error messages
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.usernameRequiredError = page.locator(
      '.oxd-input-group:has(input[name="username"]) .oxd-input-field-error-message'
    );
    this.passwordRequiredError = page.locator(
      '.oxd-input-group:has(input[name="password"]) .oxd-input-field-error-message'
    );

    // Forgot Password Page
    this.forgotPasswordTitle = page.locator('.orangehrm-forgot-password-title, .oxd-text--h6');
    this.resetUsernameInput = page.locator('.oxd-form input[placeholder="Username"]');
    this.resetButton = page.locator('button[type="submit"]:has-text("Reset Password")');
    this.cancelButton = page.locator('button[type="button"]:has-text("Cancel")');
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    // The shared demo drops the occasional cold request outright, and every test
    // starts here, so a single dropped navigation used to fail the whole test.
    // Retry the navigation itself before giving up.
    const maxAttempts = 2;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
        // Wait on the form being interactive rather than 'networkidle' -- the OrangeHRM
        // demo keeps background requests open, so 'load' and 'networkidle' are unreliable.
        await this.usernameInput.waitFor({ state: 'visible', timeout: 20000 });
        return;
      } catch (error) {
        // A live session redirects /auth/login straight to the dashboard, so the
        // username field never appears. That is not a failure to navigate.
        if (await this.isAuthenticated()) return;
        if (attempt === maxAttempts) throw error;
      }
    }
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Login and wait for successful redirect to dashboard.
   * Retries once if the first attempt doesn't land on the dashboard
   * (the public OrangeHRM demo is shared and sometimes drops requests).
   */
  async loginAsAdmin(username: string, password: string): Promise<void> {
    const maxAttempts = 2;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.login(username, password);
        await this.page.waitForURL('**/dashboard/index', { timeout: 30000, waitUntil: 'domcontentloaded' });
        // Wait for sidebar to confirm the app is interactive
        await this.page.locator('.oxd-sidepanel-body').waitFor({ state: 'visible', timeout: 15000 });
        return;
      } catch {
        // The demo is slow, so the wait above can give up on a login that actually
        // succeeded. Check before retrying: with a live session, navigating back to
        // /auth/login just redirects to the dashboard and the username field never
        // appears, which would turn a working login into a hard failure.
        if (await this.isAuthenticated()) return;
        if (attempt === maxAttempts) throw new Error('Login failed after retries — dashboard did not load');
        // Go back to login page and retry
        await this.page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
        await this.usernameInput.waitFor({ state: 'visible', timeout: 20000 });
      }
    }
  }

  /**
   * Whether the app shell is present, i.e. we hold an authenticated session
   */
  async isAuthenticated(): Promise<boolean> {
    return this.page
      .locator('.oxd-sidepanel-body')
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Click Forgot Password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL('**/requestPasswordResetCode', { timeout: 10000, waitUntil: 'domcontentloaded' });
  }

  /**
   * Submit forgot password form
   */
  async submitForgotPassword(username: string): Promise<void> {
    await this.resetUsernameInput.fill(username);
    await this.resetButton.click();
    // NOTE: on the public demo this POST hangs ~60s and then returns 504, so we wait
    // only for the form to navigate away -- never for a success page. See TC-LOGIN-009.
    await this.page.waitForURL(
      (url) => !url.pathname.endsWith('requestPasswordResetCode'),
      { timeout: 90000, waitUntil: 'domcontentloaded' }
    );
  }

  /**
   * Cancel forgot password and return to login
   */
  async cancelForgotPassword(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForURL('**/login', { timeout: 10000, waitUntil: 'domcontentloaded' });
  }

  /**
   * Assert the Reset Password page is loaded
   */
  async expectResetPasswordPageLoaded(): Promise<void> {
    await expect(this.resetUsernameInput).toBeVisible();
    await expect(this.resetButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  /**
   * Assert the reset form's client-side "Required" validation fires
   */
  async expectResetUsernameRequiredError(): Promise<void> {
    const error = this.page.locator('.oxd-input-field-error-message');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Required');
  }

  /**
   * Assert error alert is visible with expected text
   */
  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toContainText('Invalid credentials');
  }

  /**
   * Assert required field validation errors
   */
  async expectRequiredFieldErrors(): Promise<void> {
    await expect(this.usernameRequiredError).toBeVisible();
    await expect(this.usernameRequiredError).toHaveText('Required');
    await expect(this.passwordRequiredError).toBeVisible();
    await expect(this.passwordRequiredError).toHaveText('Required');
  }

  /**
   * Assert login page is loaded correctly
   */
  async expectLoginPageLoaded(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.brandLogo).toBeVisible();
  }

  /**
   * Get placeholder text for username field
   */
  async getUsernamePlaceholder(): Promise<string> {
    return (await this.usernameInput.getAttribute('placeholder')) || '';
  }

  /**
   * Get placeholder text for password field
   */
  async getPasswordPlaceholder(): Promise<string> {
    return (await this.passwordInput.getAttribute('placeholder')) || '';
  }
}
