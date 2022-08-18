const paco = require('./scrapers');

module.exports = {
    handleResponse: async (req, res, scraper, setup) => {
        const now = new Date().toISOString();
        paco.standardScrape(res, req.page, setup["url"], scraper, result => ({
            "data": result,
            "size": result[setup["key"]]?.length,
            "url": setup["url"],
            "title": setup["title"],
            "timestamp": now
        }), error => ({
            "error":"Server error",
            "url": setup["url"],
            "title": setup["title"],
            "timestamp": now
        }));
    }
}