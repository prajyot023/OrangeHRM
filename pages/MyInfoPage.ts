import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectDropdownOption } from '../utils/helpers';

/** Anchored matcher so a tab label never matches a longer one. */
const exactly = (label: string) =>
  new RegExp(`^\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);

/**
 * MyInfoPage - Page Object Model for OrangeHRM My Info / Personal Details Page
 * URL: /web/index.php/pim/viewMyDetails
 */
export class MyInfoPage extends BasePage {
  // Personal Details form elements
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly otherIdInput: Locator;
  readonly driverLicenseInput: Locator;
  readonly licenseExpiryDateInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly nationalityDropdown: Locator;
  readonly maritalStatusDropdown: Locator;
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly ssnInput: Locator;
  readonly sinInput: Locator;

  // Save buttons
  readonly savePersonalDetailsButton: Locator;
  readonly saveCustomFieldsButton: Locator;

  // Tabs
  readonly personalDetailsTab: Locator;
  readonly contactDetailsTab: Locator;
  readonly emergencyContactsTab: Locator;
  readonly dependentsTab: Locator;
  readonly immigrationTab: Locator;
  readonly jobTab: Locator;
  readonly salaryTab: Locator;
  readonly reportToTab: Locator;
  readonly qualificationsTab: Locator;

  // Profile picture
  readonly profilePicture: Locator;
  readonly changePictureButton: Locator;

  // Contact Details
  readonly street1Input: Locator;
  readonly street2Input: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly countryDropdown: Locator;
  readonly homePhoneInput: Locator;
  readonly mobileInput: Locator;
  readonly workPhoneInput: Locator;
  readonly workEmailInput: Locator;
  readonly otherEmailInput: Locator;

  constructor(page: Page) {
    super(page);

    const tab = (label: string) =>
      page.locator('.orangehrm-tabs-item', { hasText: exactly(label) }).first();

    // Personal Details
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Id")) input'
    );
    this.otherIdInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Other Id")) input'
    );
    this.driverLicenseInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("License Number")) input'
    );
    this.licenseExpiryDateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("License Expiry Date")) input'
    );
    this.dateOfBirthInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Date of Birth")) input'
    );
    this.nationalityDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Nationality")) .oxd-select-text'
    );
    this.maritalStatusDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Marital Status")) .oxd-select-text'
    );
    this.genderMaleRadio = page.locator('input[type="radio"][value="1"]');
    this.genderFemaleRadio = page.locator('input[type="radio"][value="2"]');
    this.ssnInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("SSN Number")) input'
    );
    this.sinInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("SIN Number")) input'
    );

    // Save buttons (there can be multiple Save buttons on the page)
    this.savePersonalDetailsButton = page.locator('form').first().locator('button[type="submit"]');
    this.saveCustomFieldsButton = page.locator('form').nth(1).locator('button[type="submit"]');

    // Tabs are .orangehrm-tabs-item. Match the label exactly: a substring match
    // on "Job" also hits "Job Title" labels elsewhere on the page, and the old
    // `a:has-text(...)` alternative additionally matched sidebar links.
    this.personalDetailsTab = tab('Personal Details');
    this.contactDetailsTab = tab('Contact Details');
    this.emergencyContactsTab = tab('Emergency Contacts');
    this.dependentsTab = tab('Dependents');
    this.immigrationTab = tab('Immigration');
    this.jobTab = tab('Job');
    this.salaryTab = tab('Salary');
    this.reportToTab = tab('Report-to');
    this.qualificationsTab = tab('Qualifications');

    // Profile picture
    this.profilePicture = page.locator('.orangehrm-edit-employee-image img');
    this.changePictureButton = page.locator('.orangehrm-edit-employee-image');

    // Contact Details
    this.street1Input = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Street 1")) input'
    );
    this.street2Input = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Street 2")) input'
    );
    this.cityInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("City")) input'
    );
    this.stateInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("State/Province")) input'
    );
    this.zipInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Zip/Postal Code")) input'
    );
    this.countryDropdown = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Country")) .oxd-select-text'
    );
    this.homePhoneInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Home")) input'
    );
    this.mobileInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Mobile")) input'
    );
    this.workPhoneInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Work")) input'
    );
    this.workEmailInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Work Email")) input'
    );
    this.otherEmailInput = page.locator(
      '.oxd-input-group:has(.oxd-label:text("Other Email")) input'
    );
  }

  /**
   * Navigate to My Info page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/pim/viewMyDetails');
  }

  /**
   * Assert My Info page is loaded
   */
  async expectMyInfoPageLoaded(): Promise<void> {
    // The My Info page may redirect to viewPersonalDetails with an employee number
    await expect(this.page).toHaveURL(/.*pim\/(viewMyDetails|viewPersonalDetails)/, { timeout: 15000 });
    await expect(this.firstNameInput).toBeVisible({ timeout: 15000 });
    // A visible input is not yet a populated one: the form renders blank and is
    // filled in by a follow-up XHR that on the shared demo lands seconds later.
    // Every demo employee has a first name, so use it as the hydration signal
    // for the whole form -- otherwise the value getters read back "".
    await expect(this.firstNameInput).not.toHaveValue('', { timeout: 30000 });
  }

  /**
   * Update personal details (first, middle, last name)
   */
  async updatePersonalDetails(
    firstName: string,
    middleName: string,
    lastName: string
  ): Promise<void> {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.clear();
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(lastName);
    await this.savePersonalDetailsButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Get the current first name value
   */
  async getFirstName(): Promise<string> {
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 15000 });
    return this.firstNameInput.inputValue();
  }

  /**
   * Get the current last name value
   */
  async getLastName(): Promise<string> {
    await this.lastNameInput.waitFor({ state: 'visible', timeout: 15000 });
    return this.lastNameInput.inputValue();
  }

  /**
   * Get the current Employee ID value
   */
  async getEmployeeId(): Promise<string> {
    await this.employeeIdInput.waitFor({ state: 'visible', timeout: 15000 });
    return this.employeeIdInput.inputValue();
  }

  /**
   * Switch to a different tab
   */
  async switchToTab(tabName: string): Promise<void> {
    // Try multiple selectors for tab navigation
    const tab = this.page
      .locator('.orangehrm-tabs-item', { hasText: exactly(tabName) })
      .first();
    await tab.waitFor({ state: 'visible', timeout: 20000 });
    await tab.click();
    // Each tab is a real link, and the incoming page re-renders the whole tab
    // bar. waitForPageLoad alone returns while the previous page is still on
    // screen -- its spinner check is a no-op if the spinner has not come up
    // yet -- so callers would inspect the old tab's content. The tab marking
    // itself active is the signal that the new page has actually rendered.
    await expect(tab).toHaveClass(/--active/, { timeout: 30000 });
    await this.waitForPageLoad();
  }

  /**
   * Update nationality via dropdown
   */
  async selectNationality(nationality: string): Promise<void> {
    await selectDropdownOption(
      this.page,
      '.oxd-input-group:has(.oxd-label:text("Nationality")) .oxd-select-text',
      nationality
    );
  }

  /**
   * Update marital status via dropdown
   */
  async selectMaritalStatus(status: string): Promise<void> {
    await selectDropdownOption(
      this.page,
      '.oxd-input-group:has(.oxd-label:text("Marital Status")) .oxd-select-text',
      status
    );
  }

  /**
   * Assert profile picture is visible
   */
  async expectProfilePictureVisible(): Promise<void> {
    await expect(this.profilePicture).toBeVisible();
  }

  /**
   * Assert all personal detail tabs are visible
   */
  async expectAllTabsVisible(): Promise<void> {
    await expect(this.personalDetailsTab).toBeVisible({ timeout: 10000 });
    await expect(this.contactDetailsTab).toBeVisible({ timeout: 10000 });
    await expect(this.emergencyContactsTab).toBeVisible({ timeout: 10000 });
    await expect(this.dependentsTab).toBeVisible({ timeout: 10000 });
  }
}
