<template>
  <search
    v-if="searchFilterItems.length"
    :search-items="searchFilterItems"
    :label-width="labelWidth"
    @search="searchList"
    @reset="_reset"
  />
</template>
<script>
import search from '@/components/Search'
import paramsMixin from '@/mixin/paramsMixin'
export default {
  name: 'Search',
  components: {
    search
  },
  mixins: [paramsMixin],
  props: {
    paramsList: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: String,
      default: '100px'
    }
  },
  data() {
    return {
      searchFilterItems: []
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    initSearchItems() {
      this.$nextTick(() => {
        this.searchFilterItems = this.paramsList
      })
    }
  }
}
</script>
