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

// launch queries upon search completion
let searchTimeout;
$('body').on('DOMNodeInserted', '.search-app .results .searchresult_row', (e) => {
    if ($(e.target).hasClass('searchresult_row')) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(queryScores, 250);
    }
});

function queryScores() {
    console.log('query scores');

    // get all IDs in the search results
    let ids = [];
    $('.search-app .results .searchresult_row a').each((idx, link) => {
        let id = getIdFromUrl($(link).attr('href'));
        if (id) {
            ids.push(id);
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
                    score = buildScore(game);

                // re-search for matching link
                var link = $('.search-app .results .searchresult_row a[href$="' + game.eshop_europe_fs_id + '.html"]');
                link.find('.page-title').prepend($('<div class="score ' + score.color + '">' + score.rt + '</div>'));

                link.find('img').addClass('scored ' + score.color);
            }
        });
    }
}
