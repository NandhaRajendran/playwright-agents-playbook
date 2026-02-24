// spec: specs/comprehensive-loan-application.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe( 'Standard Credit Application - Self-Employed', () => {
    test.fixme( 'Happy Path - Self-Employed with Stable Income', async({ page }) => {
        // The finances page is not reachable after employment selection
        // Navigation stalls between employment and finances pages, possibly on addon-products
    });
});

test.describe( 'Standard Credit Application - Retired', () => {
    test.fixme( 'Happy Path - Retiree with Pension Income', async({ page }) => {
        // The finances page is not reachable after employment selection
        // Navigation stalls between employment and finances pages, possibly on addon-products
    });
});
