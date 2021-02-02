// add style
var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  "#screenshots { display: flex; flex-wrap: nowrap; overflow-x: auto; margin-bottom: 1rem; }" +
  "#screenshots .screen { flex: 0 0 auto; margin-right: 0.5rem; }" +
  "#screenshots .screen img { width: 250px; margin-bottom: 0.5rem; }";
document.getElementsByTagName("head")[0].appendChild(style);

// load screenshots
var ninurl = $("a[href^='https://www.nintendo.co.uk/Games/']");
if (ninurl && ninurl.length > 0) {
    console.log(ninurl);

    // call background script for cross-site calls: chromium.org/Home/chromium-security/extension-content-script-fetches
    chrome.runtime.sendMessage({
        contentScriptQuery: "queryNintendo",
        url: ninurl.attr('href')
    },
    data => {
        var html = $(data);
        var screenshots = html.find('.mediagallery img');

        var imgContainer = $('<div id="screenshots"></div>').insertAfter($('h1').next('img').next('p'));

        screenshots.each((idx, item) => {
            var img = $(item).removeAttr('class').removeAttr('data-xs').removeAttr('width');

            imgContainer.append($('<div class="screen"></div>').append(img));
        });
    });    
}