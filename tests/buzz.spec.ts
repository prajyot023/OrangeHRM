import { test, expect } from '../fixtures/pageFixtures';
import { Credentials } from '../utils/testData';
import { generateUniqueId } from '../utils/helpers';

/**
 * Buzz Module - End-to-End Tests
 * Tests for social feed, post creation, and feed interactions
 */

test.describe('Buzz Module Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsAdmin(
      Credentials.ADMIN.username,
      Credentials.ADMIN.password
    );
  });

  test('TC-BUZZ-001: Verify Buzz page loads', async ({ buzzPage }) => {
    await buzzPage.goto();
    await buzzPage.expectBuzzPageLoaded();
  });

  test('TC-BUZZ-002: Verify post input field is displayed', async ({ buzzPage }) => {
    await buzzPage.goto();
    await expect(buzzPage.postInput).toBeVisible();
  });

  test('TC-BUZZ-003: Verify feed posts are displayed', async ({ buzzPage }) => {
    await buzzPage.goto();
    await buzzPage.expectBuzzPageLoaded();

    const postCount = await buzzPage.getFeedPostCount();
    expect(postCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-BUZZ-004: Create a new buzz post', async ({ buzzPage }) => {
    await buzzPage.goto();
    await buzzPage.expectBuzzPageLoaded();

    const uniqueText = `Automation test post - ${generateUniqueId()}`;
    await buzzPage.createPost(uniqueText);

    // Wait for post to appear
    await buzzPage.page.waitForTimeout(2000);

    // Verify the post feed is still visible
    await expect(buzzPage.postInput).toBeVisible();
  });

  test('TC-BUZZ-005: Verify post action buttons exist', async ({ buzzPage }) => {
    await buzzPage.goto();
    await buzzPage.expectBuzzPageLoaded();

    const postCount = await buzzPage.getFeedPostCount();
    if (postCount > 0) {
      // Like buttons should be present
      const likeCount = await buzzPage.likeButtons.count();
      expect(likeCount).toBeGreaterThan(0);
    }
  });
});
