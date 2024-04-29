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
  <div class="btns-wrapper">
    <template v-for="(btn, i) in btnMap">
      <span
        v-if="!btn.hide"
        :key="btn.label"
        v-step-click="{operate: handleClick, params: [btn.row, btn.label, btn.disabled]}"
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
      <i class="c-icon-arrow-down" :class="{'disable': dropdownBtnsAllDisabled}" />
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
      let btnMap = this.btns.filter(d => !d.hide)
      this.btnMap = []
      this.dropdownBtns = []
      // 超过3个按钮显示省略图标
      if (btnMap && btnMap.length > 3) {
        if (this.disabledClose) {
          btnMap = btnMap.sort((a, b) => !!a.disabled - !!b.disabled)
        }
        this.btnMap = btnMap.slice(0, 3)
        this.dropdownBtns = btnMap.slice(3)
      } else {
        this.btnMap = [...btnMap]
      }
    },
    handleClick(row, label, disabled) {
      if (disabled) return
      this.$emit('handleClick', { row, label })
    },
    getVal(val) {
      this.handleClick(val.row, val.label)
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
  .table-item-btn {
    cursor: pointer;
    margin-left: 8px;
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
    &::after{
      position: absolute;
      content: '';
      top: 50%;
      transform: translate(0, -50%);
      right: 0;
      width: 1px;
      height: 14px;
      background: #EDEDED;
    }
  }
  .table-item-btn-last {
    margin-left: 8px;
    .c-icon-arrow-down {
      font-size: 16px;
      color: $primaryColor;
    }
    .c-icon-arrow-down.disable {
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
