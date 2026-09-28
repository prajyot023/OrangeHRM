import { test, chromium } from '@playwright/test';

test('Inspect Performance Topbar', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Login
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
  await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/dashboard/index', { timeout: 30000, waitUntil: 'domcontentloaded' });
  
  // Performance page
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/performance/searchEvaluatePerformanceReview', { waitUntil: 'domcontentloaded' });
  
  // Wait for sidebar to confirm page loaded
  await page.locator('.oxd-sidepanel-body').waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(5000);
  
  console.log('=== FULL TOPBAR HTML ===');
  const topbar = page.locator('.oxd-topbar');
  if (await topbar.count() > 0) {
    const html = await topbar.first().innerHTML();
    console.log(html);
  } else {
    console.log('No .oxd-topbar found');
    // Try broader search
    const header = page.locator('header, nav, [class*="topbar"], [class*="nav"]');
    console.log(`Header/nav count: ${await header.count()}`);
    for (let i = 0; i < Math.min(await header.count(), 5); i++) {
      const cls = await header.nth(i).getAttribute('class');
      console.log(`  [${i}] class="${cls}"`);
    }
  }

  // Also try all elements with "tab" in class
  console.log('\n=== Elements with "tab" in class ===');
  const tabEls = page.locator('[class*="tab"]');
  const tabCount = await tabEls.count();
  console.log(`Count: ${tabCount}`);
  for (let i = 0; i < Math.min(tabCount, 15); i++) {
    const cls = await tabEls.nth(i).getAttribute('class');
    const text = await tabEls.nth(i).textContent();
    console.log(`  [${i}] class="${cls}" text="${text?.trim().substring(0, 50)}"`);
  }

  // Try nav-related elements
  console.log('\n=== Elements with "nav" in class ===');
  const navEls = page.locator('[class*="nav"]');
  const navCount = await navEls.count();
  console.log(`Count: ${navCount}`);
  for (let i = 0; i < Math.min(navCount, 15); i++) {
    const cls = await navEls.nth(i).getAttribute('class');
    const text = await navEls.nth(i).textContent();
    console.log(`  [${i}] class="${cls}" text="${text?.trim().substring(0, 80)}"`);
  }

  // Check for MyInfo - verify the failing tests
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails', { waitUntil: 'domcontentloaded' });
  await page.locator('input[name="firstName"]').waitFor({ state: 'visible', timeout: 15000 });
  
  console.log('\n=== MY INFO TABS ===');
  // Try different selectors for tabs
  const tabSelectors = [
    '.orangehrm-tabs-item',
    'a[class*="tab"]', 
    '[role="tab"]',
    '.oxd-tabs-item',
    'div[class*="tabs"] a',
    '.orangehrm-tabs a',
  ];
  for (const sel of tabSelectors) {
    const els = page.locator(sel);
    const count = await els.count();
    if (count > 0) {
      const texts = await els.allTextContents();
      console.log(`${sel}: ${count} items => ${JSON.stringify(texts)}`);
    }
  }

  // Check PIM page table headers
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  
  console.log('\n=== PIM TABLE HEADERS ===');
  const headers = page.locator('.oxd-table-header-cell');
  const headerCount = await headers.count();
  console.log(`Header count: ${headerCount}`);
  for (let i = 0; i < headerCount; i++) {
    const text = await headers.nth(i).textContent();
    console.log(`  [${i}]: "${text?.trim()}"`);
  }

  await browser.close();
});
