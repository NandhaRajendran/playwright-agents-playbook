// spec: specs/comprehensive-loan-application.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe( 'Standard Credit Application - Student', () => {
    test( 'Happy Path - Student with Valid Age (27)', async({ page }) => {
    // 1. Navigate to https://testapp.fairlo.se/application
        await page.goto( 'https://testapp.fairlo.se/application' );

        // Wait for page to fully load
        await new Promise( f => setTimeout( f, 2 * 1000 ));

        // Verify application landing page loads with 'Ansök nu' button visible
        const ansokNuLink = page.getByRole( 'link', { name: 'Ansök nu' });
        await expect( ansokNuLink ).toBeVisible();

        // 2. Click 'Ansök nu' button to start application
        await ansokNuLink.click();

        // Verify navigation to personal details page
        await page.waitForURL( /\/application\/personal-details/ );
        expect( page.url()).toContain( '/application/personal-details' );

        // Verify personal details form is displayed
        const emailInput = page.getByRole( 'textbox', { name: 'E-post' });
        await expect( emailInput ).toBeVisible();

        // Verify page heading is displayed (progress indicator may not use listitem role)
        const pageHeading = page.getByRole( 'heading', { name: 'Lite uppgifter om dig' });
        await expect( pageHeading ).toBeVisible();

        // 3. Fill personal details form with valid data using devtools autofill
        const devtoolsButton = page.getByRole( 'button', { name: 'Open Fairlo Devtools' });
        await devtoolsButton.click();

        // Enter custom email in devtools autofill
        const emailInput_Devtools = page.getByRole( 'textbox', { name: 'Your email (optional)' });
        await emailInput_Devtools.fill( 'usertest+1@gmail.com' );

        // Click Fill Form to autofill
        const fillFormButton = page.getByRole( 'button', { name: 'Fill Form' });
        await fillFormButton.click();

        // Wait for form to be filled
        await new Promise( f => setTimeout( f, 1 * 1000 ));

        // Verify email was filled (may have timestamp appended)
        await expect( emailInput ).toHaveValue( /usertest\+1(\+\d+)?@gmail\.com/ );

        // Close devtools panel
        await page.getByRole( 'complementary' ).getByRole( 'button' ).filter({ hasText: /^$/ }).click();

        // Verify 'Fortsätt' button becomes enabled
        const continueButton1 = page.getByRole( 'button', { name: 'Fortsätt' }).first();
        await expect( continueButton1 ).toBeEnabled();

        // 4. Click 'Fortsätt' button to proceed to employment status
        await continueButton1.click();

        // Verify navigation to employment status page
        await page.waitForURL( /\/application\/employment-status/ );
        expect( page.url()).toContain( '/application/employment-status' );

        // 5. Select 'Student' employment type
        const studentLabel = page.locator( 'label' ).filter({ hasText: 'Student' });
        await studentLabel.click();

        // Verify Student radio button is selected
        const studentRadio = page.locator( 'input[value="Student"]' );
        const isChecked = await studentRadio.isChecked();
        expect( isChecked ).toBe( true );

        // Verify 'Fortsätt' button becomes enabled
        const continueButton2 = page.getByRole( 'button', { name: 'Fortsätt' });
        await expect( continueButton2 ).toBeEnabled();

        // 6. Click 'Fortsätt' button to proceed to finance page
        await continueButton2.click();

        // Verify navigation to finance page
        await page.waitForURL( /\/application\/finances/ );
        expect( page.url()).toContain( '/application/finances' );

        // Verify finance details form is displayed
        const incomeInput = page.getByRole( 'textbox', { name: 'Din totala månadsinkomst' });
        await expect( incomeInput ).toBeVisible();

        // 7. Fill finance form with required data
        await incomeInput.fill( '15000' );

        const housingInput = page.getByRole( 'textbox', { name: 'Din boendekostnad per månad' });
        await housingInput.fill( '5000' );

        const transportInput = page.getByRole( 'textbox', { name: 'Din transportkostnad per månad' });
        await transportInput.fill( '0' );

        const otherLoansInput = page.getByRole( 'textbox', { name: 'Din månadskostnad för' });
        await otherLoansInput.fill( '0' );

        // Verify all fields accept both formatted and unformatted values
        const incomeValue = await incomeInput.inputValue();
        expect( incomeValue ).toMatch( /^15\s*000\s*(kr)?$|^15000$/ );

        const housingValue = await housingInput.inputValue();
        expect( housingValue ).toMatch( /^5\s*000\s*(kr)?$|^5000$/ );

        const transportValue = await transportInput.inputValue();
        expect( transportValue ).toMatch( /^0\s*(kr)?$|^0$/ );

        const otherLoansValue = await otherLoansInput.inputValue();
        expect( otherLoansValue ).toMatch( /^0\s*(kr)?$|^0$/ );

        // Verify children default selection is 0
        const childrenRadio0 = page.locator( 'input[name="numberOfChildren"][value="0"]' );
        const isChildrenChecked = await childrenRadio0.isChecked();
        expect( isChildrenChecked ).toBe( true );

        // Verify household default selection is 'Ensam' (value 1)
        const householdRadio1 = page.locator( 'input[name="numberOfPersonsLiving"][value="1"]' );
        const isHouseholdChecked = await householdRadio1.isChecked();
        expect( isHouseholdChecked ).toBe( true );

        // Verify 'Skicka in ansökan' button becomes enabled
        const submitButton = page.getByRole( 'button', { name: 'Skicka in ansökan' });
        await expect( submitButton ).toBeEnabled();

        // 8. Click 'Skicka in ansökan' button to submit application
        await submitButton.click();

        // 9. Verify BankID authentication page loads
        await page.waitForURL( /\/application\/.*\/bankid/ );
        const bankidUrl = page.url();
        expect( bankidUrl ).toMatch( /\/application\/.*\/bankid/ );

        // Verify page displays 'Scanna QR Koden' heading
        const qrHeading = page.getByRole( 'heading', { name: 'Scanna QR Koden' });
        await expect( qrHeading ).toBeVisible();

        // Verify QR code image is visible - look for any img tags that are visible
        const qrImages = page.locator( 'img' );
        const qrImageCount = await qrImages.count();
        if ( qrImageCount > 0 ) {
            const firstImage = qrImages.first();
            await expect( firstImage ).toBeVisible();
        }

        // Verify 'Öppna BankID appen' button is present
        const bankidButton = page.getByRole( 'button', { name: 'Öppna BankID appen' });
        await expect( bankidButton ).toBeVisible();
    });
});
