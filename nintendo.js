// add style
let style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
    ".packshot-hires a { position: relative; display: inline-block; }" +
    // score
    ".packshot-hires a .score { position: absolute; bottom: 5px; left: 5px; color: #fff; padding: 0.25rem 1rem; font-size: 2rem; }" +
    // image
    ".packshot-hires img.scored { border: 5px solid white; padding: 0; }" +
    // meta
    ".switchscore-meta { border: 1px solid #ccc; padding: 1rem; } " +
    ".switchscore-meta a { color: #008cba; } ";

// colors
for (const c in colors) {
    if (Object.hasOwnProperty.call(colors, c)) {
        const color = colors[c];
        style.textContent += ".packshot-hires a .score.score-" + c + " { background-color: " + color + " }" +
            ".packshot-hires img.score-" + c + " { border-color: " + color + "; } ";
    }
}

document.getElementsByTagName("head")[0].appendChild(style);

// parse URL to get ID
let id = getIdFromUrl(window.location.pathname);
if (id) {
    // call background script for cross-site calls: chromium.org/Home/chromium-security/extension-content-script-fetches
    chrome.runtime.sendMessage({
        contentScriptQuery: "querySwitchScores",
        id
    },
    data => {
        console.log(data);

        if (!data || data.length === 0) { return; }

        let game = data[0].game;
        let score = buildScore(game);

        // link container
        let gameLink = $('<a href="' + game.url + '" target="_blank" class="center-block"></a>');
        $('.packshot-hires').append(gameLink);

        // move image
        $('.packshot-hires img')
            .removeClass('img-responsive center-block')
            .addClass('scored score-' + score.color)
            .appendTo(gameLink);
        
        // add score
        gameLink.append($('<div class="score score-' + score.color + '" title="' + score.tooltip + '">' + score.rt + '</div>'));

        // create div to contain metadata
        let dataContainer = $('<div class="col-xs-12 col-sm-5 col-md-12 col-lg-12"></div>')
        let cont = $('<div class="row price-box-item price-box-item-top switchscore-meta"></div>');
        dataContainer.append(cont);
        cont.append($('<div class="title">Switch Scores</div>'));
        let ul = $('<ul></ul>');
        cont.append(ul);

        // reviews count
        ul.append($('<li><a href="' + game.url + '" target="_blank">'
            + game.review_count + ' review' + (game.review_count === 1 ? '' : 's')
            + (game.review_count === 0 ? ' (be the first!)' : '') + '</a></li>'));
        // category/genre
        if (game.category) {
            ul.append($('<li><a href="https://www.switchscores.com/games/by-category/' + game.category.link_title + '" target="_blank">'
                + 'Genre: ' + game.category.name + '</a></li>'));
        }
        // series
        if (game.series) {
            ul.append($('<li><a href="https://www.switchscores.com/games/by-series/' + game.series.link_title + '" target="_blank">'
                + 'Series: ' + game.series.series + '</a></li>'));
        }

        // insert data in page
        let imgContainer = $('.price-box-item[data-price-box="packshot"]').parent();
        dataContainer.insertAfter(imgContainer);
    });
}
