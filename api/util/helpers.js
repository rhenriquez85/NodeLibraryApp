//
function convertURL(req, res) {
    return new URL('http://' + req.headers.host + req.url);
}

module.exports = { convertURL };