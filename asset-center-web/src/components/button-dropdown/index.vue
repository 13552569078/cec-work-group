<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-09-02
-->
<template>
  <c-dropdown @visible-change="isShowdropdown=!isShowdropdown" @command="handleCommand">
    <c-button :type="btnType" size="small" class="btn-add" :disabled="disabled">{{ text }}<span :class="isShowdropdown?'dropdown-common-arrow':'dropdown-common-arrow dropdown-active-arrow'"></span></c-button>
    <c-dropdown-menu slot="dropdown" class="asset-add-dropdown-menu">
      <c-dropdown-item
        v-for="item in options"
        :key="item.code"
        :command="item.code"
      >{{ item.label }}</c-dropdown-item>
    </c-dropdown-menu>
  </c-dropdown>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    btnType: {
      type: String,
      default: 'gradual'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '新建资源'
    }
  },
  data() {
    return {
      isShowdropdown: false
    }
  },
  methods: {
    handleCommand(args) {
      this.$emit('command', args)
    }
  }
}
</script>

<style lang="scss">
.asset-add-dropdown-menu{
    width: 160px;
}
.btn-add{
  position: relative;
}
// .c-dropdown{
//   &:hover{
//     .dropdown-active-arrow{
//       transform:rotate(180deg);
//       transition:transform 0.2s linear;
//     }
//   }
// }
 .dropdown-common-arrow{
   position: absolute;
   margin-left: 8px;
   width: 16px;
   height: 16px;
   background-image: url('~@/assets/imgs/icon-arrow.png');
   background-size: contain;
   background-position: center;
   background-repeat: no-repeat;
   transform:rotate(180deg) ;
   transition:transform 0.2s linear;
   &.dropdown-active-arrow{
      transform:rotate(0deg);
      transition:transform 0.2s linear;
    }
 }
</style>
