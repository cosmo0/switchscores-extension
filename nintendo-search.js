// add style
let green = '#43ac6a', orange = '#e99002', red = '#f04124', noscore = '#5bc0de';
let style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // score
  ".search-app .results .searchresult_row .page-title .score { display: inline-block; color: #fff; padding: 0.25rem 1rem; margin-right: 0.5rem; }" +
  ".search-app .results .searchresult_row .page-title .score.green { background-color: " + green + " }" +
  ".search-app .results .searchresult_row .page-title .score.orange { background-color: " + orange + " }" +
  ".search-app .results .searchresult_row .page-title .score.red { background-color: " + red + " }" +
  ".search-app .results .searchresult_row .page-title .score.noscore { background-color: " + noscore + " }" +
  // image
  ".search-app .results .searchresult_row img.scored { border: 5px solid white; padding: 0; }" +
  ".search-app .results .searchresult_row img.scored.green { border-color: " + green + "; } " +
  ".search-app .results .searchresult_row img.scored.orange { border-color: " + orange + "; } " +
  ".search-app .results .searchresult_row img.scored.red { border-color: " + red + "; } " +
  ".search-app .results .searchresult_row img.scored.noscore { border-color: " + noscore + "; } ";
document.getElementsByTagName("head")[0].appendChild(style);

// parse URL to get ID
let urlParser = /.*\-(\d*)\.html$/gi

// launch queries upon search completion
let searchTimeout;
$('body').on('DOMNodeInserted', '.search-app .results .searchresult_row', (e) => {
    if ($(e.target).hasClass('searchresult_row')) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(queryScores, 500);
    }
});

function queryScores() {
    console.log('query scores');

    // get all IDs in the search results
    let ids = [];
    $('.search-app .results .searchresult_row a').each((idx, link) => {
        let urlParsed = urlParser.exec($(link).attr('href'));
        if (urlParsed && urlParsed.length > 0) {
            ids.push(urlParsed[1]);
        }
    });

    console.log('ids ', ids);

    // query API
    if (ids.length > 0) {
        // call background script for cross-site calls: chromium.org/Home/chromium-security/extension-content-script-fetches
        chrome.runtime.sendMessage({
            contentScriptQuery: "querySwitchScores",
            id: ids.join(',')
        },
        data => {
            console.log(data);        
            if (!data || data.length === 0) { return; }

            for (let i = 0; i < data.length; i++) {
                let game = data[i].game,
                    rt = 0,
                    color = 'noscore',
                    scored = false;
                if (game.review_count && game.review_count > 2) {
                    // scored
                    rt = game.rating_avg;
                    color = rt > 7.5 ? "green" : (rt > 5.5 ? "orange" : "red");
                    scored = true;
                } else if (game.review_count > 0) {
                    // not ranked
                    rt = game.rating_avg + ' ?';
                    scored = true;
                }

                // re-search for matching link
                var link = $('.search-app .results .searchresult_row a[href$="' + game.eshop_europe_fs_id + '.html"]');
                if (scored) {
                    link.find('.page-title').prepend($('<div class="score ' + color + '">' + rt + '</div>'));
                }

                link.find('img').addClass('scored ' + color);
            }
        });
    }
}
