chrome.runtime.onMessage.addListener(
    function (request, sender, callback) {
        if (request.contentScriptQuery == "queryNintendo") {
            
            console.log(request);

            $.get(request.url, html => {
                callback(html);
            });

            return true;
        }
    });