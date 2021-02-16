/**
 * Extracts the Nintendo ID from the URL
 * 
 * @param {String} url the url to parse
 */
function getIdFromUrl(url) {
    let urlParser = /.*\-(\d*)\.html$/gi;
    let urlParsed = urlParser.exec(url);
    if (urlParsed && urlParsed.length > 0) {
        return urlParsed[1];
    }

    return null;
}

/**
 * Builds the score data from the game data
 *
 * @param {String} game the game data
 */
function buildScore(game) {
    let rt = 0,
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
    } else {
        // not scored
        rt = '???';
    }

    return { rt, color, scored };
}