<template>
  <section class="section">
    <div class="container column">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title is-centered has-text-grey">
            WebCrawler
          </p>
        </header>
        <div class="card-content">
          <div class="content has-text-centered">
            <button
              class="button is-success is-medium"
              :class="loading ? 'is-loading' : ''"
              @click="startCrawl"
            >
              <span>Start</span>
            </button>
            <div v-if="loading">
              <br>
              <progress
                class="progress is-info"
                :value="loadingPercent"
                max="100"
              />
            </div>
          </div>
        </div>
        <footer class="card-footer">
          <div class="card-footer-item">
            <span>
              <b class="has-text-grey">
                Starts
              </b>
              the crawling of products from "trending" and "best seller"
            </span>
          </div>
        </footer>
      </div>
    </div>
    <div class="container">
      <b-tabs
        type="is-boxed"
        position="is-centered"
        expanded
      >
        <b-tab-item :label="`Last result (${products.length})`">
          <result-table
            v-if="products.length > 0"
            :json="products"
          />
          <p
            v-else
            class="has-text-centered"
          >
            <span v-if="!loading">
              No results
            </span>
            <span v-else>
              Loading...
            </span>
          </p>
        </b-tab-item>

        <b-tab-item :label="`All results (${allProducts.length})`">
          <result-table
            v-if="allProducts.length > 0"
            :json="allProducts"
          />
          <p
            v-else
            class="has-text-centered"
          >
            No results
          </p>
        </b-tab-item>
      </b-tabs>
    </div>
  </section>
</template>

<script>
import ResultTable from '~/components/ResultTable'

export default {
  name: 'HomePage',

  components: {
    ResultTable
  },

  async asyncData({ $axios }) {
    let allProducts = []
    try {
      allProducts = await $axios.$get('/crawl/results')
    } catch (error) {
      console.log(error)
    }

    return {
      allProducts,
      products: [],
      loading: false,
      loadingPercent: 0,
      loadingSetIntervalId: null
    }
  },

  watch: {
    loading(newValue, oldValue) {
      if (newValue) {
        this.loadingSetIntervalId = setInterval(() => {
          if (this.loadingPercent <= 99) this.loadingPercent += 0.4
          else clearInterval(this.loadingSetIntervalId)
        }, 50)
      } else {
        this.loadingPercent = 0
        clearInterval(this.loadingSetIntervalId)
      }
    }
  },

  methods: {
    async getResults() {
      try {
        this.allProducts = await this.$axios.$get('/crawl/results')
      } catch (error) {
        console.log(error)
        this.$toast.open({
          duration: 5000,
          message: `Error: Can't get results (Server error)`,
          position: 'is-top',
          type: 'is-danger'
        })
      }
    },

    async startCrawl() {
      try {
        this.loading = true
        this.products = await this.$axios.$get('/crawl/start')
        await this.getResults()
        this.loadingPercent = 100
        this.loading = false
      } catch (error) {
        this.loading = false
        this.$toast.open({
          duration: 5000,
          message: `Error: Can't start crawl (Server error)`,
          position: 'is-top',
          type: 'is-danger'
        })
        console.log(error)
      }
    }
  }
}
</script>
