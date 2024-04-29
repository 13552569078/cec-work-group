<!--/*
* @Author: dingli
* @Desc: table操作列按钮组
* @Date: 20201012
* @props: btns=[{
  hide: true/false 隐藏显示
  disabled: true/false 禁用与否
  label: '' 显示文字
  icon: 'iconClassName' 图标的className 如：operate-icon-edit
  row: row 表格当前行的row
}]
click=function 点击回调事件
*/-->
<template>
  <div class="btns-wrapper" :class="{spaceBetween:limit==1}">
    <template v-for="(btn, i) in btnMap">
      <span
        v-if="!btn.hide"
        :key="btn.label"
        v-step-click="{operate: handleClick, params: [btn.row, btn.label, btn]}"
        class="table-item-btn"
        :class="{ 'btn-disable': btn.disabled, 'has-split': i < btnMap.length-1 }"
      >{{ btn.label }}</span
      >
    </template>
    <!-- 省略按钮下拉框展示 -->
    <c-dropdown
      v-if="!!dropdownBtns.length"
      placement="bottom"
      class="table-item-btn table-item-btn-last"
      @command="getVal"
    >
      <i class="c-icon-more cls-more" :class="{'disable': dropdownBtnsAllDisabled}" />
      <c-dropdown-menu slot="dropdown">
        <template v-for="item in dropdownBtns">
          <c-dropdown-item
            v-if="!item.hide"
            :key="item.label"
            class="dropdown-menu-item"
            :command="item"
            :disabled="item.disabled"
          >
            <span class="dropdown-item-text">{{ item.label }}</span>
          </c-dropdown-item>
        </template>
      </c-dropdown-menu>
    </c-dropdown>
  </div>
</template>
<script>
export default {
  name: 'BtnGroup',
  props: {
    btns: {
      type: Array,
      default: () => []
    },
    disabledClose: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      btnMap: [],
      dropdownBtns: []
    }
  },
  computed: {
    dropdownBtnsAllDisabled() {
      let flag = true
      this.dropdownBtns.forEach(d => {
        if (!d.disabled) {
          flag = false
        }
      })
      return flag
    }
  },
  watch: {
    btns() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let btnMap = this.btns.filter(d => !d.hide && !d.disabled)
      const disabledBtns = this.btns.filter(d => d.disabled)
      this.btnMap = []
      this.dropdownBtns = []
      // 超过limit个按钮显示省略图标
      if (btnMap && btnMap.length > this.limit) {
        if (this.disabledClose) {
          btnMap = [...btnMap, ...disabledBtns]
        }
        this.btnMap = btnMap.slice(0, this.limit)
        this.dropdownBtns = btnMap.slice(this.limit)
      } else {
        this.btnMap = [...btnMap]
      }
    },
    handleClick(row, label, btnItem) {
      if (btnItem.disabled) return
      this.$emit('handleClick', { ...btnItem, row, label })
    },
    getVal(val) {
      this.handleClick(val.row, val.label, val)
    }
  }
}
</script>
<style scoped lang="scss">
@import '../../styles/variables.scss';
.btns-wrapper {
  display: flex;
  align-items: center;
  justify-content: left;
  color: $primaryColor;
  &.spaceBetween {
    justify-content: space-between;
    .table-item-btn-last {
      margin-left: 0;
    }
  }
  .table-item-btn {
    cursor: pointer;
    margin-left: 16px;
    img {
      display: inline-block;
      width: 16px;
      height: 16px;
    }
    img:nth-child(2) {
      display: none;
    }
    &:hover {
      color: $primaryColor;
      img:nth-child(1) {
        display: none;
      }
      img:nth-child(2) {
        display: inline-block;
      }
    }
    &:nth-child(1) {
      margin-left: 0;
    }
    &.btn-disable {
      color: #bdbdbd;
      cursor: no-drop;
    }
  }
  .has-split {
    position: relative;
    padding-right: 8px;
  }
  .table-item-btn-last {
    margin-left: 24px;
    .cls-more {
      padding-right: 0 !important;
      font-size: 16px;
      // color: $primaryColor;
    }
    .cls-more.disable {
      color: #bdbdbd;
    }
  }
  .dropdown-menu-item {
    padding: 0;
    .dropdown-item-text {
      display: inline-block;
      width: 100%;
      height: 100%;
      padding: 0 20px;
      text-align: center;
    }
  }
}
</style>
