# Playwright Page Object Model (POM) Automation Generation Instructions

## Role

Act as a Senior SDET specializing in Playwright TypeScript automation frameworks.

Generate automation code following Playwright best practices, Page Object Model (POM), reusable fixtures, centralized test data management, and maintainable test architecture.

---

# Framework Structure

```text
C:\AutomationFramework
│
├── pages/
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── CheckoutOverviewPage.ts
│   └── CheckoutCompletePage.ts
│
├── fixtures/
│   └── test.fixture.ts
│
├── test-data/
│   ├── users.ts
│   ├── productItems.ts
│   ├── checkout.ts
│   └── checkoutCompleteDetails.ts
│
└── tests/
    ├── auth.setup.spec.ts
    ├── login.spec.ts
    ├── products.spec.ts
    └── purchase.spec.ts
```

---

# General Standards

- Follow POM
- Use Fixtures
- Use AAA Pattern
- Centralize test data
- Use Playwright best practices
- Do not use waitForTimeout()
- Do not place assertions in Page Objects

## Master AI Prompt

```text
Act as a Senior Playwright SDET.

Generate Playwright TypeScript automation code based on the framework structure provided.

Requirements:
- Follow Page Object Model (POM).
- Use fixtures from fixtures/test.fixture.ts.
- Use centralized data from test-data folder.
- Follow AAA Pattern.
- Use Playwright best practices.
- Use TypeScript.
- Generate complete file contents.
- Do not place assertions inside page objects.
- Do not use waitForTimeout().
- Use locator priority:
  1. getByRole()
  2. getByLabel()
  3. getByPlaceholder()
  4. getByText()
  5. CSS
  6. XPath

Framework Structure:

[paste framework structure]

Scenario:
[Insert Test Scenario]

Expected Output:
1. Required Page Object updates.
2. Required Fixture updates.
3. Required Test Data updates.
4. Complete Test Implementation.
5. Explanation of Changes.
```
