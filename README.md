# Playwright Agents Playbook

A focused repository for AI-generated Playwright tests and the supporting configs, data, and helpers needed to run them.

## Whats inside
- AI test suites in `tests/` (files ending in `.ai.spec.js` and `.ai.js`)
- Playwright configuration in `playwright.config.js`
- Helpers and page objects in `helper/` and `pages/`
- Test data in `data/` and `configuration/`
- Environment setup in `setup/`
- Specs and documentation in `specs/`

## Quick start
1. Install dependencies:
   - `npm install`
2. Run all AI tests:
   - `npx playwright test tests/*.ai.spec.js`

## Environment
- Copy `.env.example` to `.env` if needed and fill in any required values.

## Notes
- This repo intentionally tracks only AI-related tests and their required support files.
- If you update the source repository, re-sync these files here.
