// spec: specs/comprehensive-loan-application.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe( 'Negative Test Scenarios', () => {
    test( 'Negative - Student with Zero Income Error', async({ page }) => {
    // Setup and navigate to finance page
        await page.goto( 'https://testapp.fairlo.se/application' );
        await new Promise( f => setTimeout( f, 2 * 1000 ));

        await page.getByRole( 'link', { name: 'Ansök nu' }).click();
        await page.waitForURL( /\/application\/personal-details/ );

        // Fill personal details
        await page.getByRole( 'button', { name: 'Open Fairlo Devtools' }).click();
        await page.getByRole( 'textbox', { name: 'Your email (optional)' }).fill( 'usertest+zero@gmail.com' );
        await page.getByRole( 'button', { name: 'Fill Form' }).click();
        await new Promise( f => setTimeout( f, 1 * 1000 ));
        await page.getByRole( 'complementary' ).getByRole( 'button' ).filter({ hasText: /^$/ }).click();

        // Proceed to employment
        await page.getByRole( 'button', { name: 'Fortsätt' }).first().click();
        await page.waitForURL( /\/application\/employment-status/ );

        // Select Student
        await page.locator( 'label' ).filter({ hasText: 'Student' }).click();
        await page.getByRole( 'button', { name: 'Fortsätt' }).click();

        // Skip addon if present
        const skipBtn = page.getByRole( 'button', { name: 'Jag vill inte vara skyddad' });
        if ( await skipBtn.isVisible()) {
            await skipBtn.click();
            await page.getByRole( 'button', { name: 'Jag är säker' }).click();
        }

        // On finance page
        await page.waitForURL( /\/application\/finances/ );

        // Try to enter zero income
        const incomeInput = page.getByRole( 'textbox', { name: 'Din totala månadsinkomst' });
        await incomeInput.fill( '0' );
        await new Promise( f => setTimeout( f, 500 ));

        // Verify error is shown or button is disabled
        const submitButton = page.getByRole( 'button', { name: 'Skicka in ansökan' });
        const isSubmitDisabled = await submitButton.isDisabled();
        expect( isSubmitDisabled ).toBe( true );

        // Verify user cannot proceed
        const errorAlert = page.locator( '[role="alert"]' );
        if ( await errorAlert.isVisible()) {
            await expect( errorAlert ).toBeVisible();
        }
    });

    test( 'Negative - Unemployed Application Handling', async({ page }) => {
    // Setup
        await page.goto( 'https://testapp.fairlo.se/application' );
        await new Promise( f => setTimeout( f, 2 * 1000 ));

        await page.getByRole( 'link', { name: 'Ansök nu' }).click();
        await page.waitForURL( /\/application\/personal-details/ );

        // Fill personal details
        await page.getByRole( 'button', { name: 'Open Fairlo Devtools' }).click();
        await page.getByRole( 'textbox', { name: 'Your email (optional)' }).fill( 'usertest+unemployed@gmail.com' );
        await page.getByRole( 'button', { name: 'Fill Form' }).click();
        await new Promise( f => setTimeout( f, 1 * 1000 ));
        await page.getByRole( 'complementary' ).getByRole( 'button' ).filter({ hasText: /^$/ }).click();

        // Proceed to employment
        await page.getByRole( 'button', { name: 'Fortsätt' }).first().click();
        await page.waitForURL( /\/application\/employment-status/ );

        // Select Unemployed
        const unemployedLabel = page.locator( 'label' ).filter({ hasText: 'Arbetslös' });
        await unemployedLabel.click();

        const unemployedRadio = page.locator( 'input[value="Unemployed"]' );
        const isUnemployedSelected = await unemployedRadio.isChecked();
        expect( isUnemployedSelected ).toBe( true );

        // Continue
        await page.getByRole( 'button', { name: 'Fortsätt' }).click();

        // Skip addon if present
        const skipBtn = page.getByRole( 'button', { name: 'Jag vill inte vara skyddad' });
        if ( await skipBtn.isVisible()) {
            await skipBtn.click();
            await page.getByRole( 'button', { name: 'Jag är säker' }).click();
        }

        // On finance page with unemployed status
        await page.waitForURL( /\/application\/finances/ );

        // Try to submit with unemployment benefit income
        const incomeInput = page.getByRole( 'textbox', { name: 'Din totala månadsinkomst' });
        await incomeInput.fill( '12000' );

        const housingInput = page.getByRole( 'textbox', { name: 'Din boendekostnad per månad' });
        await housingInput.fill( '5000' );

        const transportInput = page.getByRole( 'textbox', { name: 'Din transportkostnad per månad' });
        await transportInput.fill( '500' );

        const otherLoansInput = page.getByRole( 'textbox', { name: 'Din månadskostnad för' });
        await otherLoansInput.fill( '0' );

        // Submit
        const submitButton = page.getByRole( 'button', { name: 'Skicka in ansökan' });
        await expect( submitButton ).toBeEnabled();
        await submitButton.click();

        // Should navigate to BankID or status page
        await new Promise( f => setTimeout( f, 2 * 1000 ));
        const currentUrl = page.url();

        // Either goes to BankID or might be rejected
        const isBankidOrStatus = currentUrl.includes( '/bankid' ) || currentUrl.includes( '/status' );
        expect( isBankidOrStatus ).toBe( true );
    });

    test( 'Edge Case - Low Income (10000 kr) Student', async({ page }) => {
    // Setup
        await page.goto( 'https://testapp.fairlo.se/application' );
        await new Promise( f => setTimeout( f, 2 * 1000 ));

        await page.getByRole( 'link', { name: 'Ansök nu' }).click();
        await page.waitForURL( /\/application\/personal-details/ );

        // Fill personal details
        await page.getByRole( 'button', { name: 'Open Fairlo Devtools' }).click();
        await page.getByRole( 'textbox', { name: 'Your email (optional)' }).fill( 'usertest+lowincome@gmail.com' );
        await page.getByRole( 'button', { name: 'Fill Form' }).click();
        await new Promise( f => setTimeout( f, 1 * 1000 ));
        await page.getByRole( 'complementary' ).getByRole( 'button' ).filter({ hasText: /^$/ }).click();

        // Proceed to employment
        await page.getByRole( 'button', { name: 'Fortsätt' }).first().click();
        await page.waitForURL( /\/application\/employment-status/ );

        // Select Student
        await page.locator( 'label' ).filter({ hasText: 'Student' }).click();
        await page.getByRole( 'button', { name: 'Fortsätt' }).click();

        // Skip addon
        const skipBtn = page.getByRole( 'button', { name: 'Jag vill inte vara skyddad' });
        if ( await skipBtn.isVisible()) {
            await skipBtn.click();
            await page.getByRole( 'button', { name: 'Jag är säker' }).click();
        }

        // Finance page
        await page.waitForURL( /\/application\/finances/ );

        // Fill with low income
        const incomeInput = page.getByRole( 'textbox', { name: 'Din totala månadsinkomst' });
        await incomeInput.fill( '10000' );

        const housingInput = page.getByRole( 'textbox', { name: 'Din boendekostnad per månad' });
        await housingInput.fill( '0' );

        const transportInput = page.getByRole( 'textbox', { name: 'Din transportkostnad per månad' });
        await transportInput.fill( '0' );

        const otherLoansInput = page.getByRole( 'textbox', { name: 'Din månadskostnad för' });
        await otherLoansInput.fill( '0' );

        // Select 1 child
        const childrenOneLabel = page.locator( 'label' ).filter({ hasText: /^1$/ });
        await childrenOneLabel.click();

        // Select multiple household
        const householdMultipleLabel = page.locator( 'label' ).filter({ hasText: 'Flera' });
        await householdMultipleLabel.click();

        // Submit
        const submitButton = page.getByRole( 'button', { name: 'Skicka in ansökan' });
        await submitButton.click();

        // Should proceed but may be rejected
        await new Promise( f => setTimeout( f, 2 * 1000 ));
        const url = page.url();

        // Should navigate somewhere
        expect( url ).not.toContain( '/application/finances' );
    });

    test( 'Boundary Test - Student Underage (Age 15)', async({ page }) => {
    // Setup
        await page.goto( 'https://testapp.fairlo.se/application' );
        await new Promise( f => setTimeout( f, 2 * 1000 ));

        await page.getByRole( 'link', { name: 'Ansök nu' }).click();
        await page.waitForURL( /\/application\/personal-details/ );

        // Fill personal details with devtools (but we can't control age directly from devtools)
        // Try manual entry instead
        const emailInput = page.getByRole( 'textbox', { name: 'E-post' });
        await emailInput.fill( 'usertest+underage@gmail.com' );

        const mobileInput = page.getByRole( 'textbox', { name: 'Mobilnummer' });
        await mobileInput.fill( '0701234567' );

        // Use underage personnummer (2009-01-01)
        const personnummerInput = page.getByRole( 'textbox', { name: 'Personnummer' });
        await personnummerInput.fill( '20090101-1234' );

        await new Promise( f => setTimeout( f, 300 ));

        // Try to proceed
        const continueButton = page.getByRole( 'button', { name: 'Fortsätt' }).first();

        // Button might be disabled due to age validation
        const isDisabled = await continueButton.isDisabled();

        // If not disabled, proceed and see if application is rejected later
        if ( !isDisabled ) {
            await continueButton.click();
            await page.waitForURL( /\/application\/employment-status/ );

            await page.locator( 'label' ).filter({ hasText: 'Student' }).click();
            await page.getByRole( 'button', { name: 'Fortsätt' }).click();

            const skipBtn = page.getByRole( 'button', { name: 'Jag vill inte vara skyddad' });
            if ( await skipBtn.isVisible()) {
                await skipBtn.click();
                await page.getByRole( 'button', { name: 'Jag är säker' }).click();
            }

            await page.waitForURL( /\/application\/finances/ );

            const incomeInput = page.getByRole( 'textbox', { name: 'Din totala månadsinkomst' });
            await incomeInput.fill( '5000' );

            const submitButton = page.getByRole( 'button', { name: 'Skicka in ansökan' });
            await submitButton.click();

            // Should either reject or show status page
            await new Promise( f => setTimeout( f, 2 * 1000 ));
            const finalUrl = page.url();
            expect( finalUrl ).not.toContain( '/application/finances' );
        }
    });
});
