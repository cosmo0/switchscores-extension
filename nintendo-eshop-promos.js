// add style
let style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  // score and image
  ".page-group-list .results .page-list-group-item .page-img { position: relative; }" +
  ".page-group-list .results .page-list-group-item .score { position: absolute; bottom: 0; right: 0; display: inline-block; color: #fff; padding: 0.25rem 1rem; font-size: 1.25rem; font-weight: bold; }" +
  ".page-group-list .results .page-list-group-item img.scored { border: 5px solid white; padding: 0; margin: 0; }";

// colors
for (const c in colors) {
    if (Object.hasOwnProperty.call(colors, c)) {
        const color = colors[c];
        style.textContent += ".page-group-list .results .page-list-group-item .score.score-" + c + " { background-color: " + color + " }" +
            ".page-group-list .results .page-list-group-item img.scored.score-" + c + " { border-color: " + color + "; } ";
    }
}

document.getElementsByTagName("head")[0].appendChild(style);

// get all IDs in the promos list
let ids = [];
$('.page-group-list .results .page-list-group-item a').each((idx, link) => {
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
        console.log('data', data);
        if (!data || data.length === 0) { return; }

        for (let i = 0; i < data.length; i++) {
            let game = data[i].game,
                score = buildScore(game);

            // re-search for matching link
            var link = $('.page-group-list .results .page-list-group-item a[href$="' + game.eshop_europe_fs_id + '.html"]');

            // check if score has already been inserted (weird bug, script is run twice)
            if (link.find('.score').length > 0) {
                console.log('second trigger');
                break;
            }

            // add score number
            link.find('.page-img').append($('<div class="score score-' + score.color + '" title="' + score.tooltip + '">' + score.rt + '</div>'));

            // add image border
            link.find('.page-img img').addClass('scored score-' + score.color);
        }
    });
}
