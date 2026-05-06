import type { Page } from '@playwright/test';

const blockedConsoleTypes = new Set(['error', 'warning']);

export function collectBrowserConsoleIssues(page: Page): string[] {
  const issues: string[] = [];

  page.on('console', (message) => {
    if (!blockedConsoleTypes.has(message.type())) return;

    issues.push(`[${message.type()}] ${message.text()}`);
  });

  page.on('pageerror', (error) => {
    issues.push(`[pageerror] ${error.message}`);
  });

  return issues;
}
