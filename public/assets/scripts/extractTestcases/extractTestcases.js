if (typeof isFirefox === 'undefined') {
    let isFirefox = typeof browser !== 'undefined';
    let browserAPI = isFirefox ? browser : chrome;
}