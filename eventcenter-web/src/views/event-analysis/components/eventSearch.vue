<template>
  <search-panel
    class="event-search-container"
    label-width="90px"
    @search="search"
    @reset="reset"
  >
    <panel-item class="panel-time" label="时间范围">
      <cestc-date-picker v-model="dateRange" type="daterange" clearable />
    </panel-item>
    <panel-item label="区域" class="search-item">
      <choose-area
        :dept-id.sync="searchForm.deptId"
        check-strictly
        leaf-disabled
      />
    </panel-item>
    <panel-item label="事件类型" :visible="showEventType" class="search-item">
      <event-type-cascader
        check-strictly
        :parent-type.sync="searchForm.eventTypeLId"
        :middle-type.sync="searchForm.eventTypeMId"
        :child-type.sync="searchForm.eventTypeId"
      />
    </panel-item>
  </search-panel>
</template>

<script>
import { setDefaultTimeRange } from '@/utils/index'
import eventTypeCascader from '../../event/components/EventTypeCascader.vue'
import chooseArea from '../../event/components/EventAddress.vue'
export default {
  components: {
    eventTypeCascader,
    chooseArea
  },
  props: {
    showEventType: {
      type: Boolean,
      default: true
    },
    searchForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dateRange: []
    }
  },
  watch: {
    dateRange(nVal) {
      if (!nVal || !nVal.length) {
        this.searchForm.createBeginTime = ''
        this.searchForm.createEndTime = ''
      } else {
        this.searchForm.createBeginTime = nVal[0]
        this.searchForm.createEndTime = nVal[1]
      }
      this.$emit('update:search-form', this.searchForm)
    },
    searchForm: {
      deep: true,
      handler() {
        this.$emit('update:search-form', this.searchForm)
      }
    }
  },
  created() {
    this.dateRange = setDefaultTimeRange(30)
  },
  methods: {
    search() {
      this.$emit('search')
    },
    reset() {
      this.$emit('update:search-form', {})
      this.dateRange = setDefaultTimeRange(30)
      this.$nextTick(() => {
        this.$emit('reset')
      })
    }
  }
}
</script>
