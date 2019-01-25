<template>
  <section>
    <b-table
      ref="table"
      :data="json"
      paginated
      per-page="20"
      detailed
      detail-key="name"
    >
      <template slot-scope="props">
        <b-table-column
          field="name"
          label="Name"
          sortable
        >
          <template>
            <a @click="toggle(props.row)">
              {{ props.row.name }}
            </a>
          </template>
        </b-table-column>

        <b-table-column
          field="brand"
          label="Brand"
          sortable
        >
          {{ props.row.brand }}
        </b-table-column>

        <b-table-column
          field="price"
          label="Price"
          numeric
          sortable
        >
          £ {{ props.row.price }}
        </b-table-column>

        <b-table-column
          field="date"
          label="Date"
          sortable
          centered
        >
          <span class="tag is-success">
            {{ new Date(props.row.date).toLocaleDateString() }} {{ new Date(props.row.date).toLocaleTimeString() }}
          </span>
        </b-table-column>

        <b-table-column
          field="type"
          label="Type"
          sortable
        >
          {{ props.row.type }}
        </b-table-column>
      </template>

      <template
        slot="detail"
        slot-scope="props"
      >
        <article class="media">
          <figure class="media-left">
            <p class="image is-128x128">
              <img :src="props.row.photo">
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>Description</strong>
                <br>
                {{ props.row.description }}
              </p>
              <p>
                <strong>Ingredients</strong>
                <br>
                {{ props.row.ingredients }}
              </p>
            </div>
          </div>
        </article>
      </template>
    </b-table>
  </section>
</template>

<script>
export default {
  props: {
    json: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggle(row) {
      this.$refs.table.toggleDetails(row)
    }
  }
}
</script>
