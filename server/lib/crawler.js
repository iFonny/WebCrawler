const _ = require('lodash');
const cheerio = require('cherio');
const axios = require('axios');

class CultbeautyCrawler {
  constructor(url) {
    this.baseURL = 'https://www.cultbeauty.co.uk';
    this.url = url;
    this.$ = null;
  }

  async loadHTMLFromURL() {
    const response = await axios.get(this.url);
    return response.data;
  }

  async loadHtmlData() {
    const responseHtml = await this.loadHTMLFromURL();
    this.$ = cheerio.load(responseHtml);
  }

  /* Get URLs */

  getBestSellersURLs() {
    return _.uniq(
      this.$('.bestsellingProducts [data-list=best-selling] li article a')
        .map((idx, element) => `${this.baseURL}${this.$(element).attr('href')}`)
        .get()
    );
  }

  getTrendingURLs() {
    return _.uniq(
      this.$('.trendingProducts [data-list=trending] li article a')
        .map((idx, element) => `${this.baseURL}${this.$(element).attr('href')}`)
        .get()
    );
  }

  /* Get data */

  getProductBrand() {
    return this.$('.productHeader .productBrandTitle')
      .text()
      .trim();
  }

  getProductName() {
    return this.$('.productHeader .productTitle')
      .text()
      .trim();
  }

  getProductPrice() {
    return parseFloat(this.$('.productHeader .productPrice').text());
  }

  getProductPhoto() {
    return this.$('.productDataContainer .bigImage img').attr('src');
  }

  getProductDescription() {
    return this.$('.productInfo li.expandInfo')
      .map((idx, element) => {
        if (
          this.$(element)
            .children('.itemHeader')
            .children('.headerTitle')
            .text()
            .trim() === 'Description'
        ) {
          return this.$(element)
            .children('.itemContent')
            .text()
            .trim();
        }
      })
      .get()[0];
  }

  getProductIngredients() {
    return this.$('.productInfo li.expandInfo')
      .map((idx, element) => {
        if (
          this.$(element)
            .children('.itemHeader')
            .children('.headerTitle')
            .text()
            .trim() === 'Full ingredients list'
        ) {
          return this.$(element)
            .children('.itemContent')
            .text()
            .trim();
        }
      })
      .get()[0];
  }

  getProductData() {
    return {
      name: this.getProductName() || null,
      photo: this.getProductPhoto() || null,
      brand: this.getProductBrand() || null,
      description: this.getProductDescription() || null,
      ingredients: this.getProductIngredients() || null,
      price: this.getProductPrice() || null
    };
  }
}

module.exports = CultbeautyCrawler;
