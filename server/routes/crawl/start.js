const router = require('koa-router')();

const CultbeautyCrawler = require('@lib/crawler');
const Product = require('@models/product');

/**
 * @api {get} /start Launch crawling
 * @apiVersion 1.0.0
 * @apiGroup Crawl
 * @apiName startCrawl
 * @apiSampleRequest /api/crawl/start
 */
router.get('/start', async ctx => {
  const currentDate = Date.now();
  const { bestSellersURLs, trendingURLs } = await getProductURLs();

  // Merge bestseller & trending products
  const products = [
    ...(await getProducts(bestSellersURLs, 'bestseller', currentDate)),
    ...(await getProducts(trendingURLs, 'trending', currentDate))
  ];

  // Save products to DB and return
  try {
    await Product.insertMany(products);
    ctx.ok(products);
  } catch (err) {
    ctx.send(422, 'Unprocessable Entity');
  }
});

async function getProductURLs() {
  const crawler = new CultbeautyCrawler('https://www.cultbeauty.co.uk');

  await crawler.loadHtmlData();

  return {
    bestSellersURLs: crawler.getBestSellersURLs(),
    trendingURLs: crawler.getTrendingURLs()
  };
}

async function getProducts(URLs, type, currentDate) {
  let products = [];

  for (const url of URLs) {
    const crawler = new CultbeautyCrawler(url);
    await crawler.loadHtmlData();
    const crawlerProduct = crawler.getProductData();
    crawlerProduct.type = type;
    crawlerProduct.date = currentDate;
    products.push(crawlerProduct);
  }

  return products;
}

module.exports = router;
