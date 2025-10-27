# Contributing to Codeforces Quest

#### Welcome, and thank you for your interest in contributing to Codeforces Quest!  
#### Open source thrives because of passionate developers like you who help improve features, fix bugs, and enhance the overall experience for everyone. Whether you want to report an issue, suggest a new feature, or submit code changes, your contribution matters.

## Getting Started

#### Here’s how you can get involved and make your contribution count:

- **Explore Issues:** Find bugs or features labeled for contribution, or propose your own ideas by opening a new issue.

- **Fork & Branch:** Work from your own fork and create branches focused on specific features or fixes to keep your work organized.

- **Write Clean Code:** Follow existing coding styles and handle errors gracefully to ensure your code is robust and maintainable.

- **Commit Clearly:** Use meaningful commit messages that explain the “why” and “what” of your changes.

- **Submit Pull Requests:** When your changes are ready, submit a pull request with a clear description to help reviewers understand your contribution.

---

## Local Setup for Developers

To set up **Codeforces Quest** locally, follow these steps:

1. **Fork the repository** through GitHub  

2. Clone your forked repo:  
    ```bash
    git clone https://github.com/Vaibhav-kesarwani/Codeforces-Quest.git
    ```

3. Install dependencies:
    ```bash
    npm i
    ```

4. Build the project whenever you want to see your changes:
    ```bash
    npm run build
    ```

5. Add the extension to Chrome:
    - Open Chrome and go to **chrome://extensions/** or click **Manage extensions**

    - Enable **Developer mode** (top right corner)

    - Click **Load unpacked** and select the `dist` folder from the project

---

## Code Quality Guidelines

To maintain high code quality and consistency across the project, please adhere to the following guidelines:

### TypeScript Best Practices

- **No `any` types**: Always use specific type definitions or interfaces instead of `any`
- **Type safety**: Ensure all function parameters and return values have proper types
- **Interface definitions**: Create interfaces for complex objects and API responses
- **Type imports**: Import types from the central `types.d.ts` file

### Logging Standards

- **Use the logger utility**: Never use raw `console.log()` statements
- **Import the logger**: `import { logger } from '@/utils/logger'`
- **Log levels**:
  - `logger.log()` - General information (disabled in production)
  - `logger.info()` - Important information (disabled in production)
  - `logger.warn()` - Warnings (disabled in production)
  - `logger.error()` - Errors (always logged, even in production)
  - `logger.debug()` - Debug information (disabled in production)

### Testing Requirements

- **Write tests**: All new features and bug fixes should include tests
- **Test location**: Place tests in `__tests__` folders next to the code they test
- **Test naming**: Use descriptive test names that explain what is being tested
- **Run tests locally**: Always run `npm test` before submitting a PR

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (recommended before PR)
npm run test:run

# Run tests with UI for debugging
npm run test:ui

# Generate coverage reports
npm run test:coverage
```

### Linting and Type Checking

Before submitting your code:

```bash
# Run the linter
npm run lint

# Check TypeScript types
npx tsc --noEmit

# Build the project
npm run build
```

All three commands should complete without errors before you submit a PR.

---

## How To Contribute?

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated. Follow these steps to get involved:

1. Check for issues or feature requests you want to work on.

    - To improve existing features, find an open issue.

    - To add a new feature, raise an issue and start working on it to keep track of your progress.

2. In your forked repo, create a new branch for the feature or bug fix:
    ```bash
    git checkout -b bug/<bug-name>
    # or
    git checkout -b feature/<feature-name>
    ```

3. Make sure to handle errors properly and ensure your feature is **production-ready**.

4. Write clear and descriptive commit messages that explain what you fixed or implemented:
    ```bash
    git commit -m "feat: Implemented real-time code submission status to display submission updates without page redirects, improving user experience"
    ``` 

5. Push your branch to your forked repository:
    ```bash
    git push origin <your-branch-name>
    ```

6. #### Pull Request Checklist
    **Before submitting your PR, make sure you:**
    
    - ✅ Followed the coding style and wrote production-ready code.
    
    - ✅ Included descriptive commit messages.
    
    - ✅ **Signed your commits with a GPG key**. This verifies your identity and ensures trust in the codebase.
    
        👉 Need help? Follow GitHub’s guide here: [Signing Commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

7. When ready, create a **Pull Request (PR)** for review:

    - Go to the [original repository](https://github.com/Vaibhav-kesarwani/Codeforces-Quest) on GitHub
  
    - Click on Pull requests and then New pull request
    
    - Select your branch and submit the PR
    
    - Provide a detailed description of your changes in the PR message

#### Your PR will be reviewed and merged upon approval.


---

#### Thank you for contributing to `Codeforces Quest!` Your efforts help make the community better for everyone.
