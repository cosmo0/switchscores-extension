var colors = {
    // ranked
    0: '#8e1401',
    1: '#8e1401',
    2: '#8e1401',
    3: '#8e1401',
    4: '#b70d05',
    5: '#c14903',
    6: '#c79303',
    7: '#8db333',
    8: '#539c24',
    9: '#1ba700',
    10: '#00b50d',
    // unranked
    'unranked-0': '#8c7875',
    'unranked-1': '#8c7875',
    'unranked-2': '#8c7875',
    'unranked-3': '#8c7875',
    'unranked-4': '#b19695',
    'unranked-5': '#ab998f',
    'unranked-6': '#c1b79b',
    'unranked-7': '#abb397',
    'unranked-8': '#8ba27c',
    'unranked-9': '#7da276',
    'unranked-10': '#7da276',
    // no score
    'noscore': '#b6c5ca'
};

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
        scored = false
        tooltip = '';

    if (game.review_count && game.review_count > 2) {
        // scored
        rt = game.rating_avg;
        color = Math.floor(game.rating_avg);
        scored = true;
        tooltip = 'Average ' + game.rating_avg + '/10 from ' + game.review_count + ' reviews';
    } else if (game.review_count > 0) {
        // not ranked
        rt = game.rating_avg + ' ?';
        color = 'unranked-' + Math.floor(game.rating_avg);
        scored = true;
        tooltip = 'Average ' + game.rating_avg + '/10 from ' + game.review_count + ' review' + (game.review_count > 1 ? 's' : '') + ' (not reliable!)';
    } else {
        // not scored
        rt = '---';
        tooltip = 'No review yet!';
    }

    return { rt, color, scored, tooltip };
}
