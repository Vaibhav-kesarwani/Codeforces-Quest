const isFirefox = typeof browser !== 'undefined';
const browserAPI = isFirefox ? browser : chrome;

browserAPI.storage.local.get(["changeUI", "theme", "themeCustomSettings", "defaultThemeSettings"]).then((result) => {
    if (result.changeUI === "true") {
        document.addEventListener("DOMContentLoaded", () => {
            changeLoginPageUI();
            changeProblemSetPageUI();
        });
    }

    if (result.theme === "dark") {
        injectDarkModeCSS();
        sortToggleImgInvert();

        if (result.themeCustomSettings) {
            applyCustomThemeSettings(result.themeCustomSettings);
        } else if (result.defaultThemeSettings) {
            applyCustomThemeSettings(result.defaultThemeSettings);
        }
    }
});