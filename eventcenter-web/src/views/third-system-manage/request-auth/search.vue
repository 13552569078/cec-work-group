<template>
  <search
    v-if="searchFilterItems.length"
    :search-items="searchFilterItems"
    :has-simple="false"
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
    eventPlatformOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchFilterItems: [],
      statusOptions: [
        {
          dictDesc: '启用',
          dictValue: 1
        },
        {
          dictDesc: '停用',
          dictValue: '0'
        }
      ]
    }
  },
  computed: {
    // eventPlatformOptions() {
    //   // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
    //   return this.$store.getters.getBsDictsByType('event_platform')
    // }
  },
  watch: {
    eventPlatformOptions: {
      deep: true,
      handler(val) {
        this.$set(this.searchFilterItems[0], 'options', val)
      }
    }
  },
  created() {
    this.initSearchItems()
  },
  methods: {
    async initSearchItems() {
      await this.$nextTick()
      this.searchFilterItems = [
        {
          type: 'select',
          label: '系统名称',
          labelKey: 'sysCode',
          options: this.eventPlatformOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择平台系统'
        },

        {
          type: 'select',
          label: '启停状态',
          labelKey: 'status',
          options: this.statusOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择启停状态'
        }
      ]
    }
  }
}
</script>
