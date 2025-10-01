[![GitHub issues](https://img.shields.io/github/issues/Vaibhav-kesarwani/Codeforces-Quest)](https://github.com/Vaibhav-kesarwani/Codeforces-Quest/issues)
[![GitHub forks](https://img.shields.io/github/forks/Vaibhav-kesarwani/Codeforces-Quest)](https://github.com/Vaibhav-kesarwani/Codeforces-Quest/network)
[![GitHub stars](https://img.shields.io/github/stars/Vaibhav-kesarwani/Codeforces-Quest)](https://github.com/Vaibhav-kesarwani/Codeforces-Quest/stargazers)
[![GitHub license](https://img.shields.io/github/license/Vaibhav-kesarwani/Codeforces-Quest)](https://github.com/Vaibhav-kesarwani/Codeforces-Quest/blob/main/LICENSE)

# Codeforces Quest

#### A Chrome extension with a sidebar that enhances the Codeforces experience, transforming it into a more efficient and productive platform for competitive programmers.

# Overview

![Hero Section](/public/assets/images/overview.png)

#### Codeforces Quest delivers a streamlined and enhanced experience tailored for competitive programmers on Codeforces.

#### With improved UI elements, a sleek dark theme, and a fully integrated code editor, this extension offers everything you need for a smooth and seamless coding experience on Codeforces.

---

# Features

## 1. Powerful Monaco Code Editor with Built-in Execution and Persistent Storage Features

![Code Editor](/public/assets/images/code-editor.png)

#### Write, test, and submit your code right from the problem page using our advanced Monaco editor—no need to switch tabs or upload files manually.

### 🔑 Key Features

- #### 🗂️ Default Language Selector
  - Easily switch between popular languages:
`C++`, `Python`, `Java`, `JavaScript`, `Kotlin`, `Go`, `Rust`, `Ruby`

- #### 🧑‍💻 Rich Monaco Editor Capabilities
  
  - Syntax highlighting with multiple theme options
  
  - Intelligent code suggestions and autocomplete
  
  - Customizable indentation, line wrapping, and font size
  
  - Minimap for quick navigation
  
  - Line numbers and full editor personalization

- #### ⚙️ Built-in Code Execution System
  
  -  Automatically save code locally for each problem
  
  -  Retrieve previous submissions on revisit
  
  -  Efficiently manage `1000+` files (200+ lines each)
  
  -  Optimized storage using HashMap + Queue cleanup logic

- #### ⏱️ Practice Mode Enhancements
  
  - Built-in timer to track practice sessions
  
  - Auto-tab indentation for smooth coding flow
  
  - Language-specific code formatting support

#### This all-in-one solution brings coding, testing, and submission into a unified, streamlined interface—supercharging your competitive programming experience on Codeforces.

## 2. Code Execution

#### Experience fast, reliable code execution directly within the editor, powered by the robust Judge0 API. Enjoy real-time feedback across multiple languages without leaving the problem page. Our system seamlessly handles compilation results, making debugging clear and efficient.

- ### 🔌 API Configuration
  
  - Secure and scalable code execution using [Judge0](https://judge0.com/)
  
  - Supports multiple languages with real-time output
  
  - Seamless integration with editor for code submission and result fetching

  ![Api Configuration](/public/assets/images/api-configuration.png) 
  
- ### 📤 Compilation Results Handling
  
  - Structured output displaying
  
    - Execution results 
  
    - Time and memory metrics
  
    - Compilation and runtime errors (with **syntax context**)
  
  - Color-coded feedback for fast debugging
  
  - Clear distinction between sample test cases and custom inputs

  | Test Case Pass | Test Case Fail |
  |----------------|----------------|
  | ![](/public/assets/images/test-case-pass.png) | ![](/public/assets/images/test-case-fail.png) |

- ### 🚧 Limitations and Future Enhancements
  
  - **Current Limitations**
  
    - No support for interactive problems yet
  
    - Editor settings are not synced across devices
  
    - Supports live contests but does not display the scoreboard.
  
    - Requires internet access for code execution via Judge0
  
  - **Upcoming Features**
  
    - Interactive problem support
  
    - AI-powered hint system and problem insights
  
    - Contest mode with lockable editor and timed submissions
  
    - GitHub integration to sync and save progress
  
#### While currently limited in some areas, Codeforces Quest is rapidly evolving with exciting features like interactive problem support, AI-powered hints, and contest modes. We’re committed to enhancing your coding workflow with smarter tools and seamless integrations.

## 3. Dark Mode with Enhanced Customization Options

![Dark theme support](/public/assets/images/dark-theme.png)

#### Codeforces Quest features a carefully optimized dark theme that enhances visual comfort, especially during long coding sessions. It delivers a seamless and consistent appearance across the entire platform.

### 🌙 Key Features of the Dark Theme


- **Eye Comfort:** Minimizes eye strain by reducing screen-to-environment contrast, ideal for low-light conditions and long coding sessions.

- **Battery Efficiency:** Helps save battery on OLED and AMOLED devices by limiting bright pixel usage.

- **Enhanced Code Readability:** Syntax highlighting is carefully optimized to make keywords, variables, and comments stand out clearly without causing visual fatigue.

- **User Control:** Easily toggle between dark and light modes to suit your personal preference anytime.

- **Theme Customizer:** Personalize your dark theme experience with adjustable settings including
  - Brightness
  - Contrast
  - Sepia tone
  - Grayscale
  - Invert colors

- **Theme Presets:** Quickly switch between curated theme presets for fast and convenient visual adjustments.

## 4. Editor Theme Selection

![Editor theme support](/public/assets/images/editor-theme.png)

#### Codeforces Quest now offers a diverse selection of editor themes tailored to fit your unique coding style and preferences.


- **🏛️ Classic Themes:** `Default`, `Dark`, `Light`, `High Contrast` — timeless and reliable.

- **🌟 Popular Coding Themes:** `Monokai`, `Dracula`, `GitHub`, `Nord`, `Solarized`, and many more to fit your vibe.

- **🔄 Seamless Switching:** Change themes instantly without interrupting your flow.

- **👀 Theme Preview:** Try before you pick to find your perfect coding look.

## 5. Custom Templates & Smart Cursor Placement

![Custom template](/public/assets/images/custom-template.png)

- **✨ Auto-Loaded Templates:** Automatically load your custom code templates when opening a new problem—no more writing boilerplate from scratch.

- **⚙️ Predefined Boilerplate:** Include common code like I/O functions, imports, and debug snippets to jump straight into solving.

- **🚀 Boosts Productivity:** Focus directly on problem-solving, reducing setup time during contests or practice.

- **🎯 Smart Cursor Placement:** Use the `$0` marker in your template to set the starting cursor position exactly where you need it.

- **🔁 Cursor Memory:** Remembers your cursor position when switching tabs or revisiting problems—pick up right where you left off.

## 6. UI Enhancements

| Login UI | Problem UI |
|------------|----------|
| ![](/public/assets/images/login-ui.png) | ![](/public/assets/images/problem-ui.png) |

#### Codeforces Quest upgrades the overall UI of Codeforces, making it more accessible, visually polished, and user-friendly.

#### Interface elements are repositioned and refined for a cleaner layout and smoother navigation experience.


- **🎨 Refined Interface:** Makes Codeforces more accessible, visually appealing, and user-friendly.

- **🧭 Improved Layout:** Optimized element positioning for a cleaner and more intuitive navigation experience.

- **🗂️ Structured Problemset Page:** Enhanced alignment and spacing for a more organized and readable layout.

- **🔐 Modernized Auth Pages:** Redesigned login and registration pages for a smoother and faster onboarding experience.

- **🌑 Dark Theme Consistency:** Custom styling across extension components to perfectly match the dark theme.

- **🕹️ User Control:** Toggle the enhanced UI on or off at any time—switch easily between the original and improved layouts based on your preference.

## 7. Code Formatting

#### Codeforces Quest now features a powerful built-in code formatter to keep your code neat and readable


- **⚡ One-Click Formatting** for all supported languages

- **📘 Language-Specific Rules** to match standard coding styles

- **🔧 Customizable Indentation** to suit your personal preferences


---

# Browser Compatibility

#### Codeforces Quest now works seamlessly across multiple browsers:
- [Google Chrome]()
- [Mozilla Firefox]()
- [Brave Browser]()
- [Microsoft Edge]()

#### This cross-browser support ensures a seamless Codeforces Quest experience, no matter which browser you prefer to use.

---

# How to Get and Set Up Your API Key?

To enable the `Run Code` feature, follow these simple steps:


1. Go to [Sulu > Consumer Dashboard](https://platform.sulu.sh/portal/consumer/dashboard?period=7_days)

2. **Sign up or log in** to your Sulu account

3. Under the **Authentication section**, copy your **Live API Key**

    ![Api key](/public/assets/images/api-config-key.png)

1. Make sure to **subscribe** to activate API usage

2. Open the **Codeforces Quest** extension and navigate to **API Settings**

3. Click `Edit`, then paste your **API key**

    ![Edit api key](/public/assets/images/api-configuration.png)

4. Hit **Save** — the Run Code feature is now ready to use!

---

# Contributing

#### Contributions make this project better and help build an amazing open-source community.  
#### If you'd like to contribute, please check out our [Contribution Guide](CONTRIBUTING.md) to get started with setup instructions, guidelines, and best practices.  

#### We welcome your ideas, bug fixes, and new features!

---

## 📄 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and share it. See the [LICENSE](LICENSE) file for details.

---

## 📢 Contact

If you have any suggestions, questions, or feedback, feel free to reach out:

- 📬 **Email**: [vaibhavkesarwani100@gmail.com](mailto:vaibhavkesarwani100@gmail.com)  
- 💼 **GitHub**: [@Vaibhav-kesarwani](https://github.com/Vaibhav-kesarwani)
- 🔥 **Portfolio**: [vaibhav kesarwani](https://vaibhavkesarwani.vercel.app/)

---

## 🌟 Support & Share

If you find this repository helpful:

- ⭐ Star it on GitHub  
- 🍴 Fork it to build your own version  
- 📣 Share it with your developer friends and communities!

---

## ✨ Contributors

#### Thanks to all the wonderful contributors 💖

<a href="https://github.com/Vaibhav-kesarwani/Codeforces-Quest/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Vaibhav-kesarwani/Codeforces-Quest" />
</a>
