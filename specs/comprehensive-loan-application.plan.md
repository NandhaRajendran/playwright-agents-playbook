# Comprehensive Loan Application Test Plan

## Application Overview

This test plan covers all types of loan applications on the Fairlo platform (https://testapp.fairlo.se/application), including standard credit applications for different employment types and extended credit ("Levla") applications. The application follows a multi-step form flow: Personal Details → Employment Status → Finance Details → BankID Authentication → Offer/Status Page.

## Test Scenarios

### 1. Standard Credit Application - Student

**Seed:** `tests/seed.spec.ts`

#### 1.1. Happy Path - Student with Valid Age Range (25-30)

**File:** `tests/standard-credit/student/happy-path-valid-age.spec.ts`

**Steps:**
  1. Navigate to https://testapp.fairlo.se/application
    - expect: Application landing page loads with 'Ansök nu' button visible
    - expect: Page displays key credit features (up to 70,000 kr, free first withdrawal, etc.)
  2. Click 'Ansök nu' button to start application
    - expect: Navigate to /application/personal-details
    - expect: Personal details form is displayed
    - expect: Progress indicator shows 4 steps with 'Lite uppgifter om dig' as current
  3. Fill personal details form with valid data: email (valid format), mobile (10 digits starting with 07), personnummer (valid Swedish social security number for age 25-30)
    - expect: All fields accept input
    - expect: Fields show proper formatting (phone shows '07' prefix)
    - expect: No validation errors displayed
    - expect: 'Fortsätt' button becomes enabled
  4. Click 'Fortsätt' button
    - expect: Navigate to /application/employment-status
    - expect: Employment status form is displayed
    - expect: Progress shows 'Lite uppgifter om dig' as complete, 'Din anställningstyp' as current
  5. Select 'Student' employment type
    - expect: Student radio button is selected
    - expect: 'Fortsätt' button becomes enabled
  6. Click 'Fortsätt' button
    - expect: Navigate to /application/finances
    - expect: Finance details form is displayed
    - expect: Progress shows employment step as complete, 'Din ekonomi' as current
  7. Fill finance form with: income=15000 kr, housing cost=5000 kr, transport cost=0 kr, other loans=0 kr, children=0, household=Ensam (Single)
    - expect: All fields accept numeric input
    - expect: Currency formatting is applied (showing 'kr')
    - expect: 'Skicka in ansökan' button becomes enabled
  8. Click 'Skicka in ansökan' button
    - expect: Navigate to BankID authentication page
    - expect: Page displays QR code for BankID
    - expect: Page shows 'Scanna QR Koden' heading
    - expect: 'Öppna BankID appen' button is visible

#### 1.2. Happy Path - Student Maximum Offer (Age 27, Income 50000)

**File:** `tests/standard-credit/student/maximum-offer.spec.ts`

**Steps:**
  1. Complete personal details with age 27 (valid personnummer)
    - expect: Personal details form submitted successfully
  2. Select 'Student' employment type
    - expect: Employment status submitted successfully
  3. Fill finance form with: income=50000 kr, housing cost=0 kr, transport cost=0 kr, other loans=0 kr, children=3+, household=Ensam
    - expect: Finance details submitted successfully
    - expect: Application proceeds to BankID authentication
  4. Mock BankID authentication completion with approval
    - expect: Navigate to /credit/offer page
    - expect: Offer page displays credit offer of 20,000 kr
    - expect: Offer details are clearly visible

#### 1.3. Boundary Test - Student Underage (Age 10)

**File:** `tests/standard-credit/student/boundary-underage.spec.ts`

**Steps:**
  1. Complete personal details with age 10 (personnummer for 10-year-old)
    - expect: Personal details form accepts input
  2. Select 'Student' employment type and submit
    - expect: Employment status submitted
  3. Fill finance form with: income=15000 kr, children=2, household=Flera (Multiple)
    - expect: Finance form submitted
  4. Complete BankID authentication
    - expect: Application is rejected or redirected to /status page
    - expect: No offer page is displayed
    - expect: Status page shows rejection message or explanation

#### 1.4. Boundary Test - Student Overage (Age 100)

**File:** `tests/standard-credit/student/boundary-overage.spec.ts`

**Steps:**
  1. Complete personal details with age 100 (personnummer for 100-year-old)
    - expect: Personal details form accepts input
  2. Select 'Student' employment type and submit
    - expect: Employment status submitted
  3. Fill finance form with: income=15000 kr, children=2, household=Flera
    - expect: Finance form submitted
  4. Complete BankID authentication
    - expect: Application is rejected or redirected to /status page
    - expect: No standard offer is displayed or offer amount is not 20,000 kr

#### 1.5. Negative Test - Student with Zero Income

**File:** `tests/standard-credit/student/zero-income.spec.ts`

**Steps:**
  1. Complete personal details with age 27
    - expect: Personal details submitted successfully
  2. Select 'Student' employment type
    - expect: Employment status submitted
  3. Fill finance form with income=0 kr
    - expect: Error alert is displayed on finance page
    - expect: Form submission is prevented or shows validation error
    - expect: User cannot proceed without valid income

#### 1.6. Edge Case - Student Low Income (10000 kr)

**File:** `tests/standard-credit/student/low-income.spec.ts`

**Steps:**
  1. Complete personal details with age 27
    - expect: Personal details submitted
  2. Select 'Student' employment type
    - expect: Employment status submitted
  3. Fill finance form with: income=10000 kr, children=1, household=Flera
    - expect: Finance form submitted
  4. Complete BankID authentication
    - expect: Navigate to /status page (rejection)
    - expect: No offer is provided due to insufficient income

#### 1.7. Validation - Student with Different Household Combinations

**File:** `tests/standard-credit/student/household-combinations.spec.ts`

**Steps:**
  1. Complete personal details with age 27
    - expect: Personal details submitted
  2. Select 'Student' employment type
    - expect: Employment status submitted
  3. Test combination 1: income=14000 kr, children=0, household=Flera
    - expect: Application processes successfully
    - expect: Offer amount is ≤ 20,000 kr or appropriate for risk profile
  4. Test combination 2: income=15000 kr, children=3+, household=Ensam
    - expect: Application may be rejected or offer reduced due to high dependent ratio

### 2. Standard Credit Application - Employed (Fast anställd)

**Seed:** `tests/seed.spec.ts`

#### 2.1. Happy Path - Employed with Good Income

**File:** `tests/standard-credit/employed/happy-path.spec.ts`

**Steps:**
  1. Navigate to application start and complete personal details with age 35
    - expect: Personal details submitted successfully
  2. Select 'Fast anställd' (Permanently Employed) employment type
    - expect: Employment selection confirmed
    - expect: 'Fortsätt' button enabled
  3. Fill finance form with: income=35000 kr, housing cost=10000 kr, transport cost=2000 kr, other loans=1000 kr, children=1, household=Flera
    - expect: All financial details accepted
    - expect: Form submitted successfully
  4. Complete BankID authentication
    - expect: Navigate to /credit/offer page
    - expect: Offer amount displayed based on income and expenses
    - expect: Offer reflects better terms than student due to stable employment

#### 2.2. Edge Case - Employed with High Expenses

**File:** `tests/standard-credit/employed/high-expenses.spec.ts`

**Steps:**
  1. Complete personal details with age 40
    - expect: Personal details submitted
  2. Select 'Fast anställd' employment type
    - expect: Employment status submitted
  3. Fill finance form with: income=40000 kr, housing cost=15000 kr, transport cost=3000 kr, other loans=10000 kr, children=3+, household=Flera
    - expect: Finance form submitted (high expense ratio)
  4. Complete BankID authentication
    - expect: Offer may be reduced or rejected due to low disposable income
    - expect: If approved, credit limit is lower than typical for this income bracket

#### 2.3. Boundary Test - Employed Minimum Age (18)

**File:** `tests/standard-credit/employed/minimum-age.spec.ts`

**Steps:**
  1. Complete personal details with age 18
    - expect: Personal details accepted for legal adult
  2. Select 'Fast anställd' employment type
    - expect: Employment status submitted
  3. Fill finance form with: income=20000 kr, housing cost=5000 kr, children=0, household=Ensam
    - expect: Finance form submitted
  4. Complete BankID authentication
    - expect: Application processed
    - expect: Offer provided or appropriate rejection based on risk assessment

### 3. Standard Credit Application - Self-Employed (Egen företagare)

**Seed:** `tests/seed.spec.ts`

#### 3.1. Happy Path - Self-Employed with Stable Income

**File:** `tests/standard-credit/self-employed/happy-path.spec.ts`

**Steps:**
  1. Navigate to application and complete personal details with age 45
    - expect: Personal details submitted
  2. Select 'Egen företagare' (Self-Employed) employment type
    - expect: Self-employed option selected successfully
  3. Fill finance form with: income=40000 kr, housing cost=8000 kr, transport cost=1500 kr, other loans=2000 kr, children=2, household=Flera
    - expect: Finance details submitted
  4. Complete BankID authentication
    - expect: Navigate to offer page
    - expect: Credit offer displayed
    - expect: Terms may differ from employed due to income stability considerations

#### 3.2. Edge Case - Self-Employed with Variable Income

**File:** `tests/standard-credit/self-employed/variable-income.spec.ts`

**Steps:**
  1. Complete personal details with age 50
    - expect: Personal details submitted
  2. Select 'Egen företagare' employment type
    - expect: Employment status submitted
  3. Fill finance form with: income=25000 kr (lower end), housing cost=7000 kr, children=1, household=Ensam
    - expect: Finance form submitted
  4. Complete BankID authentication
    - expect: Offer may be conservative due to self-employment risk
    - expect: Credit limit reflects income verification requirements

### 4. Standard Credit Application - Retired (Pensionär)

**Seed:** `tests/seed.spec.ts`

#### 4.1. Happy Path - Retiree with Pension Income

**File:** `tests/standard-credit/retired/happy-path.spec.ts`

**Steps:**
  1. Navigate to application and complete personal details with age 68
    - expect: Personal details submitted for retiree age
  2. Select 'Pensionär/sjukpensionär' (Retiree/Disability Pensioner) employment type
    - expect: Retirement status selected
  3. Fill finance form with: income=18000 kr (pension), housing cost=6000 kr, transport cost=500 kr, other loans=0 kr, children=0, household=Ensam
    - expect: Finance details submitted
  4. Complete BankID authentication
    - expect: Credit offer provided appropriate for pension income
    - expect: Terms reflect stable but fixed income

#### 4.2. Boundary Test - Retiree Advanced Age (85)

**File:** `tests/standard-credit/retired/advanced-age.spec.ts`

**Steps:**
  1. Complete personal details with age 85
    - expect: Personal details accepted
  2. Select 'Pensionär/sjukpensionär' employment type
    - expect: Employment status submitted
  3. Fill finance form with: income=15000 kr, housing cost=5000 kr, children=0, household=Ensam
    - expect: Finance form submitted
  4. Complete BankID authentication
    - expect: Application may be rejected or offer limited due to age-related risk factors
    - expect: Status page explains decision if rejected

### 5. Standard Credit Application - Temporarily Employed (Vikarie/projektanställd)

**Seed:** `tests/seed.spec.ts`

#### 5.1. Happy Path - Temporary Worker with Current Employment

**File:** `tests/standard-credit/temporary/happy-path.spec.ts`

**Steps:**
  1. Navigate to application and complete personal details with age 30
    - expect: Personal details submitted
  2. Select 'Vikarie/projektanställd' (Temporary/Project Employed) employment type
    - expect: Temporary employment status selected
  3. Fill finance form with: income=28000 kr, housing cost=9000 kr, transport cost=1000 kr, other loans=500 kr, children=0, household=Ensam
    - expect: Finance details submitted
  4. Complete BankID authentication
    - expect: Credit offer provided
    - expect: Terms may be more conservative than permanent employment
    - expect: Credit limit reflects employment stability risk

### 6. Standard Credit Application - Unemployed (Arbetslös)

**Seed:** `tests/seed.spec.ts`

#### 6.1. Negative Test - Unemployed with Unemployment Benefits

**File:** `tests/standard-credit/unemployed/with-benefits.spec.ts`

**Steps:**
  1. Navigate to application and complete personal details with age 32
    - expect: Personal details submitted
  2. Select 'Arbetslös' (Unemployed) employment type
    - expect: Unemployed status selected
  3. Fill finance form with: income=12000 kr (unemployment benefits), housing cost=5000 kr, transport cost=500 kr, other loans=0 kr, children=0, household=Ensam
    - expect: Finance details submitted
  4. Complete BankID authentication
    - expect: Application likely rejected or very limited offer
    - expect: Navigate to /status page with rejection message
    - expect: Clear explanation of rejection reason

#### 6.2. Negative Test - Unemployed with No Income

**File:** `tests/standard-credit/unemployed/no-income.spec.ts`

**Steps:**
  1. Complete personal details with age 28
    - expect: Personal details submitted
  2. Select 'Arbetslös' employment type
    - expect: Employment status submitted
  3. Attempt to fill finance form with income=0 kr
    - expect: Validation error displayed on finance page
    - expect: Cannot submit form with zero income
    - expect: Error message clearly explains minimum income requirement

### 7. Personal Details Form Validation

**Seed:** `tests/seed.spec.ts`

#### 7.1. Validation - Invalid Email Format

**File:** `tests/validation/personal-details/invalid-email.spec.ts`

**Steps:**
  1. Navigate to /application/personal-details
    - expect: Personal details form displayed
  2. Enter invalid email formats: 'notanemail', 'test@', '@example.com', 'test..test@example.com'
    - expect: Email field shows validation error
    - expect: 'Fortsätt' button remains disabled
    - expect: Error message indicates invalid email format
  3. Enter valid email format: 'test@example.com'
    - expect: Validation error clears
    - expect: Field accepts input

#### 7.2. Validation - Invalid Mobile Number

**File:** `tests/validation/personal-details/invalid-mobile.spec.ts`

**Steps:**
  1. Navigate to /application/personal-details
    - expect: Form displayed
  2. Enter invalid mobile numbers: '123', '08123456789' (not mobile), '0612345678' (wrong prefix)
    - expect: Mobile field shows validation error
    - expect: Error indicates mobile must start with '07' and be 10 digits
  3. Enter valid mobile: '0701234567'
    - expect: Validation passes
    - expect: Field formatted correctly

#### 7.3. Validation - Invalid Personnummer Format

**File:** `tests/validation/personal-details/invalid-personnummer.spec.ts`

**Steps:**
  1. Navigate to /application/personal-details
    - expect: Form displayed
  2. Enter invalid personnummer formats: '12345', 'ABCDEFGHIJKL', '9999999-9999' (invalid date)
    - expect: Personnummer field shows validation error
    - expect: Helper text shows 'Ange personnummer med 10 eller 12 siffror, med eller utan bindestreck'
  3. Enter valid personnummer with 10 digits
    - expect: Validation passes
  4. Enter valid personnummer with 12 digits and hyphen
    - expect: Validation passes
    - expect: Both formats accepted

#### 7.4. Validation - All Fields Required

**File:** `tests/validation/personal-details/required-fields.spec.ts`

**Steps:**
  1. Navigate to /application/personal-details
    - expect: Form displayed with all fields empty
    - expect: 'Fortsätt' button is disabled
  2. Fill only email field
    - expect: 'Fortsätt' button remains disabled
  3. Fill email and mobile, leave personnummer empty
    - expect: 'Fortsätt' button remains disabled
  4. Fill all three fields with valid data
    - expect: 'Fortsätt' button becomes enabled
    - expect: Form can be submitted

### 8. Finance Form Validation and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 8.1. Validation - Negative Numbers Not Allowed

**File:** `tests/validation/finance/negative-numbers.spec.ts`

**Steps:**
  1. Complete personal details and employment status to reach finance page
    - expect: Finance form displayed
  2. Attempt to enter negative values in income field: '-5000'
    - expect: Field rejects negative input or shows validation error
    - expect: Cannot proceed with negative income
  3. Attempt negative values in housing cost, transport cost, other loans
    - expect: All expense fields reject negative values

#### 8.2. Validation - Non-Numeric Input Rejected

**File:** `tests/validation/finance/non-numeric-input.spec.ts`

**Steps:**
  1. Navigate to finance page
    - expect: Finance form displayed
  2. Attempt to enter text in income field: 'abc', 'five thousand'
    - expect: Field rejects non-numeric input or filters to numeric only
  3. Enter valid numeric value
    - expect: Field accepts input and formats as currency (e.g., '15 000 kr')

#### 8.3. Edge Case - Maximum Income Values

**File:** `tests/validation/finance/maximum-income.spec.ts`

**Steps:**
  1. Navigate to finance page via student flow
    - expect: Finance form displayed
  2. Enter very high income: 999999 kr
    - expect: Field accepts large values
    - expect: No upper limit validation error
    - expect: Form submits successfully
  3. Complete application
    - expect: High income results in maximum credit offer

#### 8.4. Edge Case - All Household Configurations

**File:** `tests/validation/finance/household-configurations.spec.ts`

**Steps:**
  1. Test each child option (0, 1, 2, 3+) with each household option (Ensam, Flera)
    - expect: All 8 combinations can be selected
    - expect: Each selection is reflected correctly
    - expect: Form submits with any valid combination

### 9. Navigation and Back Button Functionality

**Seed:** `tests/seed.spec.ts`

#### 9.1. Navigation - Back from Employment to Personal Details

**File:** `tests/navigation/back-employment-to-personal.spec.ts`

**Steps:**
  1. Complete personal details and reach employment page
    - expect: Employment page displayed
    - expect: 'Tillbaka' button visible
  2. Click 'Tillbaka' link
    - expect: Navigate back to /application/personal-details
    - expect: Previously entered data is retained in form fields
    - expect: Can modify data and proceed again

#### 9.2. Navigation - Back from Finance to Employment

**File:** `tests/navigation/back-finance-to-employment.spec.ts`

**Steps:**
  1. Complete personal details and employment, reach finance page
    - expect: Finance page displayed with 'Tillbaka' button
  2. Click 'Tillbaka' button
    - expect: Navigate back to /application/employment-status
    - expect: Previously selected employment type is still selected
    - expect: Can change selection and proceed

#### 9.3. Navigation - Progress Indicator Accuracy

**File:** `tests/navigation/progress-indicator.spec.ts`

**Steps:**
  1. Start application, observe progress on personal details page
    - expect: Progress shows: Current='Lite uppgifter om dig', Pending='Din anställningstyp, Boosta din kredit, Din ekonomi'
  2. Complete personal details, move to employment page
    - expect: Progress shows: Complete='Lite uppgifter om dig', Current='Din anställningstyp'
  3. Complete employment, move to finance page
    - expect: Progress shows: Complete='Lite uppgifter om dig, Din anställningstyp, Boosta din kredit', Current='Din ekonomi'

#### 9.4. Navigation - Direct URL Access Protection

**File:** `tests/navigation/direct-url-protection.spec.ts`

**Steps:**
  1. Navigate directly to /application/finances without completing previous steps
    - expect: Either redirected to /application/personal-details
    - expect: Or page shows appropriate error/guidance
    - expect: Cannot submit incomplete application

### 10. Extended Credit Application - Levla

**Seed:** `tests/seed.spec.ts`

#### 10.1. Happy Path - Levla Application for Credit Increase

**File:** `tests/levla/happy-path.spec.ts`

**Steps:**
  1. Navigate to https://testapp.fairlo.se/levla/apply
    - expect: Levla landing page loads
    - expect: Page displays header 'Ansök om utökat kreditutrymme'
    - expect: Benefits shown: 22% interest rate, free first withdrawal, flexible service, 10,000 kr credit increase
    - expect: Single credit check from Dun & Bradstreet mentioned
  2. Click 'Ansök nu' button
    - expect: Navigate to /application/personal-details
    - expect: Personal details form displayed (same flow as standard application)
  3. Complete personal details with valid existing customer data
    - expect: Personal details submitted successfully
  4. Complete employment status selection
    - expect: Employment status submitted
  5. Complete finance details
    - expect: Finance form submitted
    - expect: Proceed to BankID authentication
  6. Complete BankID authentication
    - expect: Application processed for credit increase
    - expect: Offer shows extended credit limit (original + 10,000 kr)
    - expect: Terms display 22% interest rate as advertised

#### 10.2. Validation - Levla Eligibility Check

**File:** `tests/levla/eligibility-check.spec.ts`

**Steps:**
  1. Navigate to /levla/apply as new customer (no existing credit)
    - expect: Page loads and allows application start
  2. Complete application flow
    - expect: System validates existing customer status
    - expect: If not eligible, appropriate message displayed
    - expect: If eligible, credit increase offer provided

### 11. Privacy and Terms Compliance

**Seed:** `tests/seed.spec.ts`

#### 11.1. Compliance - Privacy Policy Link

**File:** `tests/compliance/privacy-policy.spec.ts`

**Steps:**
  1. Navigate to personal details page
    - expect: Privacy statement visible: 'Genom att fortsätta förstår jag att mina uppgifter kan användas enligt Integritetspolicy'
    - expect: 'Integritetspolicy' is a clickable link
  2. Click 'Integritetspolicy' link
    - expect: Opens https://test.fairlo.se/integrity in new tab or same tab
    - expect: Privacy policy page loads successfully

#### 11.2. Compliance - Terms and Conditions on Finance Page

**File:** `tests/compliance/terms-conditions.spec.ts`

**Steps:**
  1. Navigate to finance page
    - expect: Terms acceptance statement visible: 'Jag godkänner att min ansökan behandlas enligt Allmänna villkor'
    - expect: 'Allmänna villkor' is clickable
  2. Click 'Allmänna villkor' button
    - expect: Terms and conditions modal/page opens
    - expect: Terms are readable and complete

### 12. BankID Integration

**Seed:** `tests/seed.spec.ts`

#### 12.1. BankID - QR Code Display

**File:** `tests/bankid/qr-code-display.spec.ts`

**Steps:**
  1. Complete full application flow to BankID page
    - expect: Navigate to URL matching pattern /application/[uuid]/bankid
    - expect: Page displays 'Scanna QR Koden' heading
    - expect: QR code image is visible
    - expect: 'Öppna BankID appen' button is present

#### 12.2. BankID - Mobile App Launch

**File:** `tests/bankid/mobile-app-launch.spec.ts`

**Steps:**
  1. Reach BankID authentication page
    - expect: BankID page displayed
  2. Click 'Öppna BankID appen' button
    - expect: Attempt to launch BankID app via deep link
    - expect: On mobile: BankID app opens
    - expect: On desktop: Appropriate message or QR code emphasis

#### 12.3. BankID - Timeout Handling

**File:** `tests/bankid/timeout-handling.spec.ts`

**Steps:**
  1. Reach BankID page and wait without authenticating
    - expect: After timeout period (typically 3-5 minutes), session expires
    - expect: User shown timeout message
    - expect: Option to restart application or return to start

### 13. Accessibility and Usability

**Seed:** `tests/seed.spec.ts`

#### 13.1. Accessibility - Keyboard Navigation

**File:** `tests/accessibility/keyboard-navigation.spec.ts`

**Steps:**
  1. Navigate to personal details page, use Tab key to move through form
    - expect: All form fields are reachable via Tab
    - expect: Focus indicator is clearly visible on each field
    - expect: Tab order follows logical visual flow
  2. Use Enter key to submit form
    - expect: Form submits successfully without mouse interaction

#### 13.2. Accessibility - Screen Reader Labels

**File:** `tests/accessibility/screen-reader-labels.spec.ts`

**Steps:**
  1. Inspect all form fields for proper ARIA labels and accessible names
    - expect: All input fields have associated labels
    - expect: Radio buttons have descriptive text
    - expect: Buttons have clear action descriptions
    - expect: Error messages are announced to screen readers

#### 13.3. Usability - Mobile Responsiveness

**File:** `tests/accessibility/mobile-responsive.spec.ts`

**Steps:**
  1. Load application on mobile viewport (375x667)
    - expect: All form elements are visible without horizontal scroll
    - expect: Touch targets are minimum 44x44px
    - expect: Text is readable without zooming
  2. Complete full application flow on mobile
    - expect: All interactions work via touch
    - expect: Keyboard opens appropriately (numeric for numbers, email for email)
    - expect: Progress indicator adapts to mobile layout

### 14. Cross-Browser Compatibility

**Seed:** `tests/seed.spec.ts`

#### 14.1. Cross-Browser - Chrome

**File:** `tests/cross-browser/chrome.spec.ts`

**Steps:**
  1. Execute full happy path flow in Chrome browser
    - expect: All features work correctly
    - expect: Form validation functions properly
    - expect: Navigation flows smoothly
    - expect: BankID integration loads correctly

#### 14.2. Cross-Browser - Firefox

**File:** `tests/cross-browser/firefox.spec.ts`

**Steps:**
  1. Execute full happy path flow in Firefox browser
    - expect: All features work correctly
    - expect: No browser-specific issues
    - expect: Date formatting in personnummer works
    - expect: Currency formatting displays correctly

#### 14.3. Cross-Browser - Safari

**File:** `tests/cross-browser/safari.spec.ts`

**Steps:**
  1. Execute full happy path flow in Safari browser
    - expect: All features work correctly
    - expect: Form inputs function properly
    - expect: No webkit-specific rendering issues
