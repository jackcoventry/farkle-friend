import type { Page } from '@playwright/test';

const blockedConsoleTypes = new Set(['error', 'warning']);
const ignoredConsoleMessages = [
  /The resource .*\/_next\/static\/chunks\/.*\.css was preloaded using link preload but not used within a few seconds from the window's load event\./,
];

export function collectBrowserConsoleIssues(page: Page): string[] {
  const issues: string[] = [];

  page.on('console', (message) => {
    if (!blockedConsoleTypes.has(message.type())) return;
    if (ignoredConsoleMessages.some((pattern) => pattern.test(message.text()))) return;

    issues.push(`[${message.type()}] ${message.text()}`);
  });

  page.on('pageerror', (error) => {
    issues.push(`[pageerror] ${error.message}`);
  });

  return issues;
}
