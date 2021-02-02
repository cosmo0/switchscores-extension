function parseNintendo(url) {
    // example url: https://www.nintendo.co.uk/Games/Nintendo-Switch-download-software/Heaven-s-Vault-1892235.html
    return url.substring(url.lastIndexOf("-") + 1).replace(".html", "");
}