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
    git clone <Your Forked Repo>
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
