<!--
 * @Description:一标N实搜索  简易搜索和高级搜索切换
 * @Author: qiyongguo
 * @Date: 2022-02-15
-->
<template>
  <div v-if="mode === 1 && hasSimple" class="simple-search">
    <div class="combine-search">
      <div class="search-type">
        <el-select v-model="simpleSearchType" @change="simpleTypeChange">
          <el-option
            v-for="item in avaiableSearchItems"
            :key="item.labelKey"
            :label="item.label"
            :value="item.labelKey"
          />
        </el-select>
      </div>
      <div class="search-content">
        <cestc-cascader
          v-if="simpleContent.type === 'cascade'"
          v-model="simpleContent.value"
          :placeholder="simpleContent.placeholder"
          :options="simpleContent.options"
          :show-all-levels="false"
          :props="simpleContent.props || { checkStrictly: true,value: 'id', label:'name' }"
          @change="orgChange"
        />
        <el-cascader
          v-if="simpleContent.type === 'elCascader'"
          v-model="simpleContent.value"
          :props="simpleContent.props"
          :options.sync="simpleContent.options"
          @change="handlePlatformChange"
        />
        <choose-area
          v-if="simpleContent.type === 'areaCascader'"
          :dept-id.sync="simpleContent.gridId"
          :node-names.sync="simpleContent.nodeNames"
          :levels.sync="simpleContent.levels"
          :check-strictly="simpleContent.option && simpleContent.option.checkStrictly"
          @change="areaChange"
        />
        <event-type-cascader
          v-if="simpleContent.type === 'eventCascader'"
          check-strictly
          :parent-type.sync="simpleContent.eventTypeLId"
          :middle-type.sync="simpleContent.eventTypeMId"
          :child-type.sync="simpleContent.eventTypeId"
          :node-name.sync="simpleContent.nodeName"
        />
        <event-type-cascader-history
          v-if="simpleContent.type === 'eventCascaderHistory'"
          check-strictly
          :parent-type.sync="simpleContent.eventTypeLId"
          :middle-type.sync="simpleContent.eventTypeMId"
          :child-type.sync="simpleContent.eventTypeId"
          :node-name.sync="simpleContent.nodeName"
        />
        <!------------------普通下拉------------------->
        <el-select
          v-if="simpleContent.type === 'select' && !simpleContent.isGroup"
          v-model="simpleContent.value"
          :placeholder="simpleContent.placeholder"
          :multiple="simpleContent.option && simpleContent.option.multiple"
          collapse-tags
          :disabled="simpleContent.option && simpleContent.option.disabled"
          :filterable="simpleContent.filterable"
          :remote="simpleContent.remote"
          :remote-method="simpleContent.remoteMethod"
          :class="simpleContent.filterable ? 'el-select-filterable' : ''"
          @change="selectChange(simpleContent)"
        >
          <el-option
            v-for="item in simpleContent.options"
            :key="
              item[simpleContent.option && simpleContent.option.value] || item.dictValue
            "
            :label="
              item[simpleContent.option && simpleContent.option.key] || item.dictDesc
            "
            :value="
              item[simpleContent.option && simpleContent.option.value] || item.dictValue
            "
          />
        </el-select>
        <el-input
          v-if="simpleContent.type === 'input'"
          v-model="simpleContent.value"
          :placeholder="simpleContent.placeholder"
        />
        <cestc-date-picker
          v-if="simpleContent.type === 'date'"
          v-model="simpleContent.value"
          :type="simpleContent.timeType"
        />
        <el-date-picker
          v-if="simpleContent.type === 'datetimerange'"
          v-model="simpleContent.value"
          type="datetimerange"
          :format="simpleContent.format"
          :value-format="simpleContent.format"
          :default-time="simpleContent.defaultTime"
          :placeholder="simpleContent.placeholder"
          :start-placeholder="simpleContent.startPlaceholder||`开始时间`"
          :end-placeholder="simpleContent.endPlaceholder||`结束时间`"
          range-separator="至"
        />
        <platformSource
          v-if="simpleContent.type === 'platformSource'"
          v-model="simpleContent.value"
          :options.sync="simpleContent.options"
          :label-name.sync="simpleContent.labelName"
          :contain-current-system="simpleContent.containCurrentSystem || false"
          :source-platform="1"
          :handle-platform="0"
        />
        <platformSource
          v-if="simpleContent.type === 'platformThirdAll'"
          v-model="simpleContent.value"
          :options.sync="simpleContent.options"
          :label-name.sync="simpleContent.labelName"
          :source-platform="simpleContent.sourcePlatform !== undefined ? simpleContent.sourcePlatform : undefined"
          :handle-platform="simpleContent.handlePlatform !== undefined ? simpleContent.handlePlatform : undefined"
        />
      </div>
    </div>
    <div class="s-btns">
      <el-button type="primary" class="cestc-button" @click="_search">搜索</el-button>
      <span class="seach-switch" @click="mode = 2">高级搜索</span>
    </div>
  </div>
  <div v-else class="advance-search">
    <el-form
      :inline="true"
      :label-width="labelWidth"
      :label-position="labelPosition"
      class="cestc-form"
      @submit.native.prevent
    >
      <el-form-item
        v-for="item in avaiableSearchItems"
        :key="item.labelKey"
        class="cestc-search-item"
        :label="item.label"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="item.value"
          :placeholder="item.placeholder"
        />

        <el-select
          v-if="item.type === 'select'"
          v-model="item.value"
          popper-class="right-el-select-popover"
          :placeholder="item.placeholder"
          :multiple="item.option && item.option.multiple"
          :disabled="item.option && item.option.disabled"
          collapse-tags
          :popper-append-to-body="false"
          @change="selectChange($event, item)"
        >
          <el-option
            v-for="sitem in item.options"
            :key="sitem.dictValue || sitem.dictValue "
            :label="sitem.dictDesc || sitem.dictDesc "
            :value="sitem.dictValue || sitem.dictValue "
          />
        </el-select>
        <cestc-cascader
          v-if="item.type === 'cascade'"
          v-model="item.value"
          :placeholder="item.placeholder"
          :options="item.options"
          :props="item.props || { checkStrictly: true,value: 'id', label:'name' }"
          :show-all-levels="false"
          @change="orgChange"
        />
        <el-cascader
          v-if="item.type === 'elCascader'"
          v-model="item.value"
          :props="item.props"
          :options.sync="item.options"
          :show-all-levels="false"
        />
        <choose-area
          v-if="item.type === 'areaCascader'"
          :dept-id.sync="item.gridId"
          :node-names.sync="item.nodeNames"
          :levels.sync="item.levels"
          :check-strictly="item.option && item.option.checkStrictly"
          @visible-change="visibleChange"
        />
        <event-type-cascader
          v-if="item.type === 'eventCascader'"
          check-strictly
          :parent-type.sync="item.eventTypeLId"
          :middle-type.sync="item.eventTypeMId"
          :child-type.sync="item.eventTypeId"
          :node-name.sync="item.nodeName"
        />
        <event-type-cascader-history
          v-if="item.type === 'eventCascaderHistory'"
          check-strictly
          :parent-type.sync="item.eventTypeLId"
          :middle-type.sync="item.eventTypeMId"
          :child-type.sync="item.eventTypeId"
          :node-name.sync="item.nodeName"
        />
        <cestc-date-picker
          v-if="item.type === 'date'"
          v-model="item.value"
          :type="item.timeType"
        />
        <el-date-picker
          v-if="item.type === 'datetimerange'"
          v-model="item.value"
          type="datetimerange"
          :format="item.format"
          :value-format="item.format"
          :default-time="item.defaultTime"
          :placeholder="item.placeholder"
          :start-placeholder="item.startPlaceholder||`开始时间`"
          :end-placeholder="item.endPlaceholder||`结束时间`"
          range-separator="至"
        />
        <platformSource
          v-if="item.type === 'platformSource'"
          v-model="item.value"
          :options.sync="item.options"
          :label-name.sync="item.labelName"
          :contain-current-system="item.containCurrentSystem || false"
          :source-platform="1"
          :handle-platform="0"
        />
        <platformSource
          v-if="item.type === 'platformThirdAll'"
          v-model="item.value"
          :options.sync="item.options"
          :label-name.sync="item.labelName"
          :source-platform="item.sourcePlatform !== undefined ? item.sourcePlatform : undefined"
          :handle-platform="item.handlePlatform !== undefined ? item.handlePlatform : undefined"
        />
      </el-form-item>
    </el-form>
    <div class="a-btns">
      <el-button class="cestc-button" @click="_reset">重置</el-button>
      <el-button type="primary" class="cestc-button" @click="_search">查询</el-button>
      <span v-if="hasSimple" class="seach-switch" @click="mode = 1">简易搜索</span>
    </div>
  </div>
</template>

<script>
import eventTypeCascader from '@/views/event/components/EventTypeCascader' // 普通的事件类型
import EventTypeCascaderHistory from '@/views/event/components/EventTypeCascaderHistory' // 历史查询事件类型
import chooseArea from '@/views/event/components/EventAddress.vue'
import platformSource from '@/views/event/components/platformSource.vue'

export default {
  name: 'OneStandardThreeActualIndex',
  components: {
    eventTypeCascader,
    EventTypeCascaderHistory,
    chooseArea,
    platformSource
  },
  props: {
    // 搜索项
    searchItems: {
      type: Array,
      default: () => []
    },
    // 默认模式 1简易 2高级
    defaultMode: {
      type: Number,
      default: 1
    },
    // 简易模式下 默认展示哪个类型
    // eslint-disable-next-line vue/require-default-prop
    defaultSimpleType: [String, Number],
    labelWidth: {
      type: String,
      default: 'auto'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    // 是否有简易模式
    hasSimple: {
      type: Boolean,
      default: true
    },
    visibleChange: {
      type: Function,
      default: () => ({})
    }
  },
  data() {
    return {
      mode: this.hasSimple ? this.defaultMode : 2,
      simpleSearchType: '',
      simpleContent: {},
      cascaderKey: 1
    }
  },
  computed: {
    avaiableSearchItems() {
      return this.searchItems.filter(item => !item.hidden)
    }
  },
  created() {
    let idx = 0
    if (this.defaultSimpleType && this.avaiableSearchItems.length) {
      idx = this.avaiableSearchItems.findIndex(item => item.labelKey === this.defaultSimpleType)
      idx === -1 && (idx = 0)
    }
    this.simpleSearchType = this.avaiableSearchItems[idx].labelKey
    this.simpleContent = this.avaiableSearchItems[idx]
    // 如果有默认值，则进行默认值赋值
    this.$nextTick(() => {
      if (this.simpleContent.defaultValue || this.simpleContent.defaultValue.length) {
        this.$set(this.simpleContent, 'value', this.simpleContent.defaultValue)
      }
    })
  },

  methods: {
    selectChange(value, item) {
      try {
        // 返回对象中的回调
        item?.change(value, item)
      } catch (error) {
        console.log('no select fn')
      }
    },
    orgChange(deptIds) {
      this.$emit('orgChange', deptIds)
    },
    areaChange(deptIds) {
      this.$emit('areaChange', deptIds)
    },
    handlePlatformChange(val) {
      this.$emit('platformChange', val)
    },
    simpleTypeChange(type) {
      this.simpleContent = this.avaiableSearchItems.find(item => item.labelKey === type)
    },
    _search() {
      this.$emit('search')
    },
    _reset() {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.simple-search {
  padding: 20px;
  display: flex;
  align-items: center;
  .combine-search {
    display: flex;
    .search-type {
      width: 168px;
      margin-right: 8px;
    }
    .search-content {
      width: 400px;
      .el-select, .el-input, .el-cascader, .el-date-picker {
        width: 100%;
      }
    }
  }
  .s-btns {
    margin-left: 24px;
  }
}
// 可以在该处做适配
.advance-search {
  padding: 20px;
  .cestc-search-item {
    &.el-form-item{
      margin-bottom: 20px;
      margin-right: 24px;
      padding-left: 0;
    }
    ::v-deep {
      .el-form-item__content{
        .el-cascader,.el-select,.cestc-date-picker,.el-range-editor {
          width: 100%;
        }
      }
       .el-form-item__label {
        line-height: 32px;
      }
    }
  }
  .a-btns {
    margin-top: 4px;
    text-align: center;
    .el-button+.el-button {
      margin-left: 16px;
    }
  }
}
.seach-switch {
  color: #4b4b4b;
  margin-left: 16px;
  cursor: pointer;
  &:hover, &:active {
    color: $primaryColor;
  }
}
</style>
