const crypto = require('crypto');

class UrlShortener {
    static generateShortUrl(staticPart = 'stfy') {
        const randomPart = crypto.randomBytes(6).toString('hex');
        return staticPart + randomPart;
    }
}

module.exports = UrlShortener;
