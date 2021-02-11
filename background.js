chrome.runtime.onMessage.addListener(
    function (request, sender, callback) {
        if (request.contentScriptQuery == "queryNintendo") {
            console.log(request);

            $.get(request.url, html => {
                callback(html);
            });

            return true;
        }
        
        if (request.contentScriptQuery == "querySwitchScores") {
            console.log(request);

            var url = 'https://www.switchscores.com/api/game/linkid/' + request.id;

            $.get(url, html => {
                callback(html);
            });

            return true;
        }
    });