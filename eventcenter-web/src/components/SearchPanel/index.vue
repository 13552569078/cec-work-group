<!--
 * @description 通用页面搜索区域
 * @date 2021-08-13
 * @author lism
 -->
<template>
  <div :class="['cestc-search-panel', { 'single-search': singleRow }]">
    <el-form
      inline
      :label-width="labelWidth"
      :label-position="labelPosition"
      class="cestc-form"
      :style="{ maxHeight: searchToolHeight }"
      @submit.native.prevent
    >
      <slot />
      <!-- 解决不是 4 倍数的情况下样式错乱问题 -->
      <!-- <el-form-item class="after-add cestc-form-item" /> -->
    </el-form>
    <div class="panel-actions">
      <slot name="actions" />
      <el-button class="cestc-button" @click="reset">重置</el-button>
      <el-button
        type="primary"
        class="cestc-button"
        @click="search"
      >查询</el-button>
    </div>
    <div v-show="showExpand" class="search-more">
      <!-- 点击拓展 -->
      <i
        v-if="!expanded"
        class="el-icon-arrow-down"
        @click="toggleExpandStatus(true)"
      />
      <!-- 点击收齐 -->
      <i v-else class="el-icon-arrow-up" @click="toggleExpandStatus(false)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CestcSearchPanel',
  componentName: 'CestcSearchPanel',
  props: {
    labelWidth: {
      type: String,
      default: '100px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    }
  },
  data() {
    return {
      expanded: false, // 收起展开状态
      searchToolHeight: '145px', // 搜索高度, 默认两行高度
      showExpand: false,
      slotsLengths: 1, // 子节点插入的有效的表单元素
      slotsItemHeight: 33 + 16 // 每个表单元素的高度
    }
  },
  computed: {
    singleRow() {
      return this.slotsLengths <= 3
    }
  },
  created() {
    this.$on('init', this.refresh)
  },
  mounted() {
    window.addEventListener('resize', this.refresh)
    this.refresh()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.refresh)
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        this.init()
      })
    },
    init() {
      this.toggleExpandStatus(false)
      this.elWidthValue = this.$el.offsetWidth
      const _avaiableSlots = this.$slots.default.filter((item) => {
        return item.componentInstance && item.componentInstance.visible
      })
      // 获取其中一个，计算到其高度， 16 为 margin-bottom值 进行了微调
      this.slotsItemHeight = _avaiableSlots[0].elm.offsetHeight + 15 || 33 + 15
      // 从插槽中判断是否有时间区间插件，如果有，则一个计算为两个
      const classListDom = _avaiableSlots.filter((item) =>
        item.elm.classList.contains('panel-item-two')
      )
      this.slotsLengths = _avaiableSlots.length + classListDom.length || 1
      this.updateHeight()
    },
    // update searchToolHeight
    updateHeight() {
      this.showExpand = false
      const { slotsLengths, slotsItemHeight } = this
      let _slotsRow = Math.ceil(slotsLengths / 4)
      if (_slotsRow > 2) {
        this.showExpand = true
        _slotsRow = 2
      }
      this.searchToolHeight = _slotsRow * slotsItemHeight + 'px'
    },
    // 搜索更多条件展开、收起
    toggleExpandStatus(expanded) {
      // 如果展开则，form 表单高度自适应，收起，则只显示三行
      if (expanded) {
        this.searchToolHeight = ''
      } else {
        this.updateHeight()
      }
      this.expanded = !!expanded
    },
    // search
    search() {
      this.$emit('search')
    },
    // reset
    reset() {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
