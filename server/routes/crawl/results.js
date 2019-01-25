const router = require('koa-router')();
const json2csv = require('json-2-csv');

const { BadRequest } = require('@lib/error');
const Product = require('@models/product');

/**
 * @api {get} /results Get all crawled results
 * @apiVersion 1.0.0
 * @apiGroup Crawl
 * @apiName getResults
 * @apiParam (query string) {string} format csv or json
 * @apiSampleRequest /api/crawl/results
 */
router.get('/results', async ctx => {
  const format = ctx
    .checkQuery('format')
    .default('json')
    .toLow()
    .in(['json', 'csv'], 'Only json and csv formats are accepted.').value;

  if (ctx.errors) throw new BadRequest(ctx.errors);

  const products = await Product.find()
    .lean()
    .select(['-_id', '-__v']);

  switch (format) {
    case 'json':
      return ctx.ok(products);

    case 'csv':
      const csv = await json2csv.json2csvAsync(products);
      ctx.set({
        'Content-Type': 'text/csv',
        'Content-disposition': 'attachment; filename=crawled.csv'
      });
      ctx.statusCode = 200;
      return (ctx.body = csv);

    default:
      return ctx.ok(products);
  }
});

module.exports = router;
