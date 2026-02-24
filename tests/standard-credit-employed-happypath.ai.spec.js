// spec: specs/comprehensive-loan-application.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe( 'Standard Credit Application - Employed', () => {
    test( 'Happy Path - Employed with Good Income', async({ page }) => {
    // 1. Navigate to https://testapp.fairlo.se/application
        await page.goto( 'https://testapp.fairlo.se/application' );

        // Wait for page to load
        await new Promise( f => setTimeout( f, 2 * 1000 ));

        // Verify application landing page loads
        const ansokNuLink = page.getByRole( 'link', { name: 'Ansök nu' });
        await expect( ansokNuLink ).toBeVisible();

        // 2. Click 'Ansök nu' button
        await ansokNuLink.click();

        // Verify navigation to personal details
        await page.waitForURL( /\/application\/personal-details/ );

        // 3. Fill personal details with valid email and autofill
        const devtoolsButton = page.getByRole( 'button', { name: 'Open Fairlo Devtools' });
        await devtoolsButton.click();

        const emailDevtoolsInput = page.getByRole( 'textbox', { name: 'Your email (optional)' });
        await emailDevtoolsInput.fill( 'usertest+2@gmail.com' );

        const fillFormButton = page.getByRole( 'button', { name: 'Fill Form' });
        await fillFormButton.click();

        // Wait for form to be filled
        await new Promise( f => setTimeout( f, 1 * 1000 ));

        // Close devtools
        await page.getByRole( 'complementary' ).getByRole( 'button' ).filter({ hasText: /^$/ }).click();

        // Verify email field is filled (may have timestamp appended)
        const emailInput = page.getByRole( 'textbox', { name: 'E-post' });
        await expect( emailInput ).toHaveValue( /usertest\+2(\+\d+)?@gmail\.com/ );

        // 4. Click 'Fortsätt' button
        const continueButton1 = page.getByRole( 'button', { name: 'Fortsätt' }).first();
        await expect( continueButton1 ).toBeEnabled();
        await continueButton1.click();

        // Verify navigation to employment status
        await page.waitForURL( /\/application\/employment-status/ );

        // 5. Select 'Fast anställd' (Permanently Employed) employment type
        const employedLabel = page.locator( 'label' ).filter({ hasText: 'Fast anställd' });
        await employedLabel.click();

        // Verify selection
        const employedRadio = page.locator( 'input[value="Employed"]' );
        const isEmployedSelected = await employedRadio.isChecked();
        expect( isEmployedSelected ).toBe( true );

        // 6. Click 'Fortsätt' button
        const continueButton2 = page.getByRole( 'button', { name: 'Fortsätt' });
        await expect( continueButton2 ).toBeEnabled();
        await continueButton2.click();

        // Navigate through addon products page
        await page.waitForURL( /\/application\/addon-products/ );

        // Skip protection products
        const skipProtectionButton = page.getByRole( 'button', { name: 'Jag vill inte vara skyddad' });
        await expect( skipProtectionButton ).toBeVisible();
        await skipProtectionButton.click();

        // Confirm in dialog
        const confirmSkipButton = page.getByRole( 'button', { name: 'Jag är säker' });
        await expect( confirmSkipButton ).toBeVisible();
        await confirmSkipButton.click();

        // Verify navigation to finances
        await page.waitForURL( /\/application\/finances/ );

        // 7. Fill finance form with income=35000 kr, housing cost=10000 kr, transport=2000 kr, other loans=1000 kr, children=1, household=Flera
        const incomeInput = page.getByRole( 'textbox', { name: 'Din totala månadsinkomst' });
        await incomeInput.fill( '35000' );
        // Accept both formatted (35 000 kr) and unformatted (35000) values
        const incomeValue = await incomeInput.inputValue();
        expect( incomeValue ).toMatch( /^35\s*000\s*(kr)?$|^35000$/ );

        const housingInput = page.getByRole( 'textbox', { name: 'Din boendekostnad per månad' });
        await housingInput.fill( '10000' );
        // Similarly, accept both formats
        const housingValue = await housingInput.inputValue();
        expect( housingValue ).toMatch( /^10\s*000\s*(kr)?$|^10000$/ );

        const transportInput = page.getByRole( 'textbox', { name: 'Din transportkostnad per månad' });
        await transportInput.fill( '2000' );

        const otherLoansInput = page.getByRole( 'textbox', { name: 'Din månadskostnad för' });
        await otherLoansInput.fill( '1000' );
        // Accept both formatted and unformatted values
        const otherLoansValue = await otherLoansInput.inputValue();
        expect( otherLoansValue ).toMatch( /^1\s*000\s*(kr)?$|^1000$/ );

        // Select 1 child
        const childrenOneLabel = page.locator( 'label' ).filter({ hasText: /^1$/ });
        await childrenOneLabel.click();
        const childrenOneRadio = page.locator( 'input[name="numberOfChildren"][value="1"]' );
        const isChildrenOneSelected = await childrenOneRadio.isChecked();
        expect( isChildrenOneSelected ).toBe( true );

        // Select multiple adults household
        const householdMultipleLabel = page.locator( 'label' ).filter({ hasText: 'Flera' });
        await householdMultipleLabel.click();
        const householdMultipleRadio = page.locator( 'input[name="numberOfPersonsLiving"][value="2"]' );
        const isHouseholdMultipleSelected = await householdMultipleRadio.isChecked();
        expect( isHouseholdMultipleSelected ).toBe( true );

        // Verify submit button is enabled
        const submitButton = page.getByRole( 'button', { name: 'Skicka in ansökan' });
        await expect( submitButton ).toBeEnabled();

        // 8. Click 'Skicka in ansökan' button
        await submitButton.click();

        // 9. Verify BankID page loads
        await page.waitForURL( /\/application\/.*\/bankid/ );
        const bankidUrl = page.url();
        expect( bankidUrl ).toMatch( /\/application\/.*\/bankid/ );

        // Verify BankID authentication page elements
        const qrHeading = page.getByRole( 'heading', { name: 'Scanna QR Koden' });
        await expect( qrHeading ).toBeVisible();

        const bankidButton = page.getByRole( 'button', { name: 'Öppna BankID appen' });
        await expect( bankidButton ).toBeVisible();
    });
});
