/**
 * COMPREHENSIVE PLAYWRIGHT TEST SUITE
 * Fairlo Loan Application (https://testapp.fairlo.se/application)
 * 
 * ============================================================================
 * TEST SUITE OVERVIEW
 * ============================================================================
 * 
 * This test suite provides comprehensive coverage of the Fairlo loan
 * application platform, testing all application types, employment statuses,
 * form validations, accessibility features, and compliance requirements.
 * 
 * All test files use the `.ai.spec.js` naming convention.
 * All test emails use the pattern: name+number@domain.com
 * 
 * ============================================================================
 * TEST FILES STRUCTURE
 * ============================================================================
 */

const COMPREHENSIVE_TEST_GUIDE = {

    fileList: `
  📁 tests/
  ├── standard-credit-student-happypath.ai.spec.js
  ├── standard-credit-employed-happypath.ai.spec.js
  ├── standard-credit-self-employed-retired.ai.spec.js
  ├── validation-personal-details.ai.spec.js
  ├── validation-finance.ai.spec.js
  ├── navigation-levla.ai.spec.js
  ├── negative-scenarios-edge-cases.ai.spec.js
  ├── accessibility-compliance-bankid.ai.spec.js
  └── TEST_SUITE_SUMMARY.ai.js (this file)
  `,

    // Application Flow Tested
    applicationFlow: `
  
  Standard Credit Application Flow:
  ==================================
  1. Landing Page (/application)
       ↓
  2. Personal Details (/application/personal-details)
       - Email validation
       - Mobile number validation
       - Personnummer validation
       ↓
  3. Employment Status (/application/employment-status)
       - 6 employment types available
       ↓
  4. Addon Products (/application/addon-products) [Optional]
       - Protection products offer
       - Can be skipped
       ↓
  5. Finance Details (/application/finances)
       - Income and expense details
       - Household configuration
       ↓
  6. BankID Authentication (/application/[uuid]/bankid)
       - QR code display
       - Mobile app launch
       ↓
  7. Offer/Status Page (/credit/offer or /status)
       - Credit offer or rejection
  
  Levla (Extended Credit) Application:
  ====================================
  Same flow but accessed from /levla/apply
  Provides 10,000 kr additional credit limit
  `,

    // Employment Types Covered
    employmentTypes: `
  
  6 Employment Types Tested:
  =========================
  1. Fast anställd (Permanently Employed)
     - Tests: standard-credit-employed-happypath.ai.spec.js
     - Income: 35,000 kr typical
     
  2. Student
     - Tests: standard-credit-student-happypath.ai.spec.js
     - Income: 15,000 kr typical
     - Maximum offer: 20,000 kr
     
  3. Egen företagare (Self-Employed)
     - Tests: standard-credit-self-employed-retired.ai.spec.js
     - Income: 40,000 kr typical
     - May have stricter validation
     
  4. Pensionär/sjukpensionär (Retired/Disability Pensioner)
     - Tests: standard-credit-self-employed-retired.ai.spec.js
     - Income: 18,000 kr (pension) typical
     - Age-dependent eligibility
     
  5. Vikarie/projektanställd (Temporary/Project Employed)
     - Referenced in validation tests
     - May have restrictions on credit amount
     
  6. Arbetslös (Unemployed)
     - Tests: negative-scenarios-edge-cases.ai.spec.js
     - Lower approval rate expected
     - May require unemployment benefits proof
  `,

    // Form Validations
    formValidations: `
  
  Personal Details Validations:
  =============================
  Email:
    - Invalid: "notanemail", "test@", "@example.com", "test..test@example.com"
    - Valid: Any standard email format
    - Test file: validation-personal-details.ai.spec.js
  
  Mobile Number:
    - Must start with 07
    - Must be 10 digits long
    - Invalid: "123", "08123456789", "0612345678"
    - Valid: "0701234567"
    - Test file: validation-personal-details.ai.spec.js
  
  Personnummer (Swedish Social Security Number):
    - 10 digits (YYMMDDXXXX) or 12 digits (YYYYMMDDXXXX) format
    - With or without hyphen (-)
    - Invalid: "12345", "ABCDEFGHIJKL", "9999999-9999"
    - Valid: "9001011234", "19900101-1234"
    - Test file: validation-personal-details.ai.spec.js
  
  Finance Form Validations:
  ==========================
  Income:
    - Must be greater than 0 kr
    - No negative values allowed
    - Non-numeric input rejected
    - Test file: validation-finance.ai.spec.js
  
  Housing/Transport/Other Loans:
    - No negative values allowed
    - Non-numeric input rejected
    - Can be 0 kr
    - Test file: validation-finance.ai.spec.js
  
  Household Configuration:
    - Children: 0, 1, 2, or 3+
    - Adults: Ensam (Single) or Flera (Multiple)
    - All 8 combinations tested
    - Test file: validation-finance.ai.spec.js
  `,

    // Email Pattern Strategy
    emailStrategy: `
  
  Email Pattern: name+number@domain.com
  ======================================
  
  WHY THIS PATTERN?
  - Avoids AWS credential credibility issues
  - Uses email aliases (subaddressing)
  - Each test can use unique email: usertest+1@, usertest+2@, etc.
  - Gmail, and most email providers support this pattern
  - Single mailbox receives all emails (usertest+anything@gmail.com → usertest@gmail.com)
  
  EXAMPLES USED:
  - usertest+1@gmail.com
  - usertest+2@gmail.com
  - usertest+3@gmail.com
  - valid.email+1@example.com
  - test+mobile@example.com
  - usertest+compliance@gmail.com
  - usertest+bankid@gmail.com
  (33 total unique emails used across all tests)
  `,

    // Key Test Scenarios
    testScenarios: `
  
  Happy Path Tests (6):
  ====================
  - Student with valid age (27)
  - Employed with good income (35,000 kr)
  - Self-Employed with stable income (40,000 kr)
  - Retiree with pension income (18,000 kr)
  - Levla application for credit increase
  - Complete flow through BankID
  
  Validation Tests (7):
  ====================
  - Invalid email formats
  - Invalid mobile numbers
  - Invalid personnummer formats
  - Required field validation
  - Negative number rejection
  - Non-numeric input rejection
  - All household configurations
  
  Navigation Tests (4):
  ====================
  - Back button from employment to personal details (data retained)
  - Back button from finance to employment (selection retained)
  - Progress indicator accuracy at each step
  - Direct URL access protection
  
  Negative Tests (4):
  ==================
  - Zero income error handling
  - Unemployed application processing
  - Low income (10,000 kr) scenarios
  - Underage applicant (age 15)
  
  Levla Tests (2):
  ================
  - Landing page elements verification
  - Complete Levla application flow
  
  Accessibility Tests (7):
  =======================
  - Privacy policy link compliance
  - Terms & conditions link compliance
  - Keyboard navigation support
  - Screen reader labels
  - Focus indicators
  - Radio button accessibility
  - BankID QR code display
  `,

    // Running Instructions
    runningTests: `
  
  RUNNING ALL TESTS:
  ==================
  npx playwright test tests/*.ai.spec.js
  
  RUNNING SPECIFIC TEST FILE:
  ===========================
  npx playwright test tests/standard-credit-student-happypath.ai.spec.js
  npx playwright test tests/validation-personal-details.ai.spec.js
  npx playwright test tests/navigation-levla.ai.spec.js
  
  RUNNING WITH UI MODE:
  =====================
  npx playwright test tests/*.ai.spec.js --ui
  
  RUNNING IN DEBUG MODE:
  ======================
  npx playwright test tests/*.ai.spec.js --debug
  
  RUNNING AGAINST SPECIFIC BROWSER:
  ==================================
  npx playwright test tests/*.ai.spec.js --project=chromium
  npx playwright test tests/*.ai.spec.js --project=firefox
  npx playwright test tests/*.ai.spec.js --project=webkit
  
  GENERATING HTML REPORT:
  =======================
  npx playwright test tests/*.ai.spec.js
  npx playwright show-report
  
  RUNNING TESTS IN HEADED MODE:
  ==============================
  npx playwright test tests/*.ai.spec.js --headed
  `,

    // Debugging Tips
    debuggingTips: `
  
  DEBUGGING FAILED TESTS:
  =======================
  1. Use --debug flag:
     npx playwright test tests/filename.ai.spec.js --debug
  
  2. Add page.screenshot() before assertions:
     await page.screenshot({ path: 'debug-' + Date.now() + '.png' });
  
  3. Use page.pause() to stop execution:
     await page.pause();
  
  4. View test traces:
     npx playwright show-trace trace.zip
  
  5. Check console logs:
     page.on('console', msg => console.log(msg.text()));
  
  6. Use --headed mode to see browser:
     npx playwright test tests/filename.ai.spec.js --headed
  `,

    // Expected Results
    expectedResults: `
  
  HAPPY PATH TESTS:
  - All should PASS
  - Navigate through complete application flow
  - Reach BankID authentication page
  
  VALIDATION TESTS:
  - All should PASS
  - Forms reject invalid input
  - Buttons remain disabled until valid input
  `
};

export default COMPREHENSIVE_TEST_GUIDE;
