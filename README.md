# Fintech API Automation Framework
A professional QA automation suite demonstrating API validation logic for financial services.

# 🛡️ Fintech API Automation Framework

A professional-grade automated testing suite designed to validate high-stakes financial transaction flows. This project demonstrates the "Shift-Left" testing philosophy by integrating quality checks early in the development lifecycle.

## 🚀 Core Features
- **Type-Safe Testing:** Built with **TypeScript** to ensure robust test data structures.
- **API Validation:** Comprehensive test cases for **STK Push** initiation, including authorization and boundary checks.
- **CI/CD Integration:** Powered by **GitHub Actions** to provide immediate feedback on every code change.
- **Mocking Architecture:** Demonstrates how to test complex business logic without relying on external third-party API uptime.

## 🛠️ Tech Stack
- **Language:** TypeScript
- **Test Runner:** Jest
- **Assertion Library:** Supertest
- **CI/CD:** GitHub Actions

## How to Run
1. **Clone the repo:**
   ```bash
   git clone [https://github.com/CM-Mike/kopo-kopo-qa-test.git](https://github.com/CM-Mike/kopo-kopo-qa-test.git)

## Setup
1. Clone the repo: `git clone [URL]`
2. Install dependencies: `npm install`
3. Run tests: `npm test`

## Key Scenarios Tested
- **STK Push Initiation:** Validates successful transaction triggers.
- **Security:** Ensures 401 Unauthorized for missing tokens.
- **Data Integrity:** Prevents negative amount processing.