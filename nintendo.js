// add style
let green = '#43ac6a', orange = '#e99002', red = '#f04124';
let style = document.createElement("style");
style.setAttribute("type", "text/css");
style.textContent =
  ".packshot-hires a { position: relative; display: inline-block; }" +
  // score
  ".packshot-hires a .score { position: absolute; bottom: 5px; left: 5px; color: #fff; padding: 0.25rem 1rem; font-size: 2rem; }" +
  ".packshot-hires a .score.green { background-color: " + green + " }" +
  ".packshot-hires a .score.orange { background-color: " + orange + " }" +
  ".packshot-hires a .score.red { background-color: " + red + " }" +
  // image
  ".packshot-hires img.scored { border: 5px solid white; padding: 0; }" +
  ".packshot-hires img.score-green { border-color: " + green + "; } " +
  ".packshot-hires img.score-orange { border-color: " + orange + "; } " +
  ".packshot-hires img.score-red { border-color: " + red + "; } " +
  // meta
  ".switchscore-meta { border: 1px solid #ccc; padding: 1rem; } " +
  ".switchscore-meta a { color: #008cba; } ";
document.getElementsByTagName("head")[0].appendChild(style);

// parse URL to get ID
let urlParser = /.*\-(\d*)\.html$/gi
let urlParsed = urlParser.exec(window.location.href);
if (urlParsed && urlParsed.length > 0) {
    let id = urlParsed[1];

    // call background script for cross-site calls: chromium.org/Home/chromium-security/extension-content-script-fetches
    chrome.runtime.sendMessage({
        contentScriptQuery: "querySwitchScores",
        id
    },
    data => {
        console.log(data);

        if (!data) { return; }

        // display score in image
        if (data.game.rating_avg && data.game.rating_avg > 0) {
            let rt = data.game.rating_avg;
            let color = rt > 7.5 ? "green" : (rt > 5.5 ? "orange" : "red");

            // link container
            let gameLink = $('<a href="' + data.game.url + '" target="_blank" class="center-block"></a>');
            $('.packshot-hires').append(gameLink);

            // move image
            $('.packshot-hires img')
                .removeClass('img-responsive center-block')
                .addClass('scored score-' + color)
                .appendTo(gameLink);
            
            // add score
            gameLink.append($('<div class="score ' + color + '">' + rt + '</div>'));
        }

        // create div to contain metadata
        let dataContainer = $('<div class="col-xs-12 col-sm-5 col-md-12 col-lg-12"></div>')
        let cont = $('<div class="row price-box-item price-box-item-top switchscore-meta"></div>');
        dataContainer.append(cont);
        cont.append($('<div class="title">Switch Scores</div>'));
        let ul = $('<ul></ul>');
        cont.append(ul);

        // insert metadata into the list
        if (data.game.review_count) {
            ul.append($('<li><a href="' + data.game.url + '" target="_blank">' + data.game.review_count + ' reviews</a></li>'));
        }
        if (data.game.category) {
            ul.append($('<li><a href="https://www.switchscores.com/games/by-category/' + data.game.category.link_title + '" target="_blank">'
                + 'Genre: ' + data.game.category.name + '</a></li>'));
        }
        if (data.game.series) {
            ul.append($('<li><a href="https://www.switchscores.com/games/by-series/' + data.game.series.link_title + '" target="_blank">'
                + 'Series: ' + data.game.series.series + '</a></li>'));
        }

        // insert data in page
        let imgContainer = $('.price-box-item[data-price-box="packshot"]').parent();
        dataContainer.insertAfter(imgContainer);
    });
}
