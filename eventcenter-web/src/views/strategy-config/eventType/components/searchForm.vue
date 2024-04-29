<template>
  <search
    v-if="searchFilterItems.length"
    :search-items="searchFilterItems"
    :has-simple="true"
    @search="searchList"
    @reset="_reset"
  />
</template>
<script>
import search from '@/components/Search'
import paramsMixin from '@/mixin/paramsMixin'
import speTypeMixin from '@/mixin/speTypeMixin'
export default {
  name: 'SearchForm',
  components: {
    search
  },
  mixins: [speTypeMixin, paramsMixin],
  data() {
    return {
      searchFilterItems: [] // 搜索条件
    }
  },
  computed: {
    bsDicts() {
      return this.$store.getters.bsDicts
    },
    eventTypeBusiTypeOptions() {
      return this.$store.getters.getBsDictsByType('event_type_busi_type')
    },
    dispatchDealParam() {
      const dispatchDealItem = this.searchFilterItems.find(item => item.labelKey === 'dispatchDeal')
      return dispatchDealItem ? dispatchDealItem.value : ''
    }
  },
  watch: {
    'bsDicts.length'(val, oVal) {
      if (oVal === 0 && val) this.initSearchItems()
    },
    dispatchDealParam(val) {
      const zxItem = this.searchFilterItems.find(item => item.labelKey === 'speType')
      if (zxItem) {
        if (val === '0') {
          this.$set(zxItem, 'hidden', false)
          this.$set(zxItem, 'options', this.speTypeOptions)
          this.$set(zxItem, 'value', '')
        } else if (val === '1') {
          this.$set(zxItem, 'hidden', false)
          this.$set(zxItem, 'options', this.ldzh_speTypeOptions)
          this.$set(zxItem, 'value', '')
        } else {
          this.$set(zxItem, 'hidden', true)
          this.$set(zxItem, 'value', '')
        }
      }
    }
  },
  created() {
    this.bsDicts?.length && this.initSearchItems()
  },
  methods: {
    async initSearchItems() {
      await this.$nextTick()
      const arr = [
        {
          type: 'input',
          label: '类型名称',
          labelKey: 'name',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入事件类型名称'
        },
        {
          type: 'select',
          label: '状态',
          labelKey: 'status',
          options: [{ dictDesc: '启用', dictValue: '0' }, { dictDesc: '停用', dictValue: '1' }],
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'select',
          label: '联动指挥',
          labelKey: 'dispatchDeal',
          options: [{ dictDesc: '是', dictValue: '1' }, { dictDesc: '否', dictValue: '0' }],
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        },
        {
          type: 'input',
          label: '类型编码',
          labelKey: 'code',
          options: [],
          value: '',
          defaultValue: '',
          placeholder: '请输入类型编码'
        }
      ]
      if (this.speType) {
        arr.push({
          type: 'select',
          label: '业务分类',
          labelKey: 'busiType',
          options: this.eventTypeBusiTypeOptions,
          value: '',
          defaultValue: '',
          placeholder: '请选择'
        })
        // 筛选单一的专项类型
        const zxItem = {
          type: 'cascade',
          label: '专项类型',
          labelKey: 'speType',
          options: this.speTypeOptions,
          hidden: true,
          props: {
            checkStrictly: true, value: 'dictValue', label: 'dictDesc'
          },
          value: this.speType !== 'all' ? this.getAllParent(this.speType) : [],
          defaultValue: this.speType !== 'all' ? this.getAllParent(this.speType) : [],
          placeholder: '请选择'
        }
        arr.push(zxItem)
      }
      this.searchFilterItems = arr
      this.searchList()
    }
  }
}
</script>
