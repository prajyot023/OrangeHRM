import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * BuzzPage - Page Object Model for OrangeHRM Buzz (Social Feed) Module
 * URL: /web/index.php/buzz/viewBuzz
 */
export class BuzzPage extends BasePage {
  // Post creation
  readonly postInput: Locator;
  readonly postButton: Locator;
  readonly sharePhotosButton: Locator;
  readonly shareVideoButton: Locator;

  // Feed posts
  readonly feedPosts: Locator;
  readonly postTexts: Locator;

  // Post actions
  readonly likeButtons: Locator;
  readonly commentButtons: Locator;
  readonly shareButtons: Locator;

  // Comment section
  readonly commentInput: Locator;

  constructor(page: Page) {
    super(page);

  // Post creation
    this.postInput = page.locator('.oxd-buzz-post-input textarea, .oxd-buzz-post textarea').first();
    this.postButton = page.locator('.oxd-buzz-post button[type="submit"]').first();
    this.sharePhotosButton = page.locator('.orangehrm-buzz-post-actions button').nth(0);
    this.shareVideoButton = page.locator('.orangehrm-buzz-post-actions button').nth(1);

    // Feed
    this.feedPosts = page.locator('.orangehrm-buzz-post');
    this.postTexts = page.locator('.orangehrm-buzz-post-body-text');

    // Actions
    this.likeButtons = page.locator('.orangehrm-buzz-post-actions .oxd-icon-button').first();
    this.commentButtons = page.locator(
      '.orangehrm-buzz-post-actions .oxd-icon-button:has(.oxd-icon.bi-chat-text-fill)'
    );
    this.shareButtons = page.locator(
      '.orangehrm-buzz-post-actions .oxd-icon-button:has(.oxd-icon.bi-share-fill)'
    );

    // Comment
    this.commentInput = page.locator('.orangehrm-buzz-comment input');
  }

  /**
   * Navigate to Buzz page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/buzz/viewBuzz');
  }

  /**
   * Assert Buzz page is loaded
   */
  async expectBuzzPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*buzz\/viewBuzz/);
    await expect(this.postInput).toBeVisible({ timeout: 15000 });
  }

  /**
   * Create a new buzz post
   */
  async createPost(text: string): Promise<void> {
    await this.postInput.click();
    // A modal may appear for the post
    const modalTextarea = this.page.locator('.oxd-buzz-post-modal textarea');
    if (await modalTextarea.isVisible({ timeout: 3000 }).catch(() => false)) {
      await modalTextarea.fill(text);
      // In the modal, the post/share button is typically a submit button
      const modalPostBtn = this.page.locator('.oxd-buzz-post-modal button[type="submit"]').first();
      if (await modalPostBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await modalPostBtn.click();
      } else {
        // Fallback: find any button with "Post" or "Share" text in the modal
        const shareBtn = this.page.locator('.oxd-buzz-post-modal button').last();
        await shareBtn.click();
      }
    } else {
      await this.postInput.fill(text);
      await this.postButton.click();
    }
    await this.waitForPageLoad();
  }

  /**
   * Get count of visible feed posts
   */
  async getFeedPostCount(): Promise<number> {
    return this.feedPosts.count();
  }

  /**
   * Get text of the latest (first) post
   */
  async getLatestPostText(): Promise<string> {
    return (await this.postTexts.first().textContent()) || '';
  }

  /**
   * Like the first post in the feed
   */
  async likeFirstPost(): Promise<void> {
    await this.likeButtons.first().click();
    await this.page.waitForTimeout(1000);
  }
}
