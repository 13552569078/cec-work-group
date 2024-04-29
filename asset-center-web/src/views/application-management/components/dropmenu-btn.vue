<template>
  <c-popover
    placement="bottom"
    trigger="click"
    @show="isShowdropdown=true"
    @hide="isShowdropdown=false">
    <c-button slot="reference" type="primary" size="small" class="btn-add">{{ title }}<span :class="isShowdropdown?'dropdown-common-arrow':'dropdown-common-arrow dropdown-active-arrow'"></span></c-button>
    <c-menu ref="dropmenu" class="c-menu-dropdown select-btn" menu-trigger="hover"
            @select="select">
      <template v-for="item in options" :index="item.value">
        <c-menu-item v-if="!item.children||item.children.length===0||item.children.filter(item=>!item.hidden).length===0" :key="item.value" :index="item.children.length?item.children[0].value:item.value">{{ item.label }}</c-menu-item>
        <c-submenu v-else :key="'dd'+item.value" :index="item.value">
          <template slot="title">{{ item.label }}</template>
          <c-menu-item v-for="_item in item.children" :key="_item.value" :index="_item.value">{{ _item.label }}</c-menu-item>
        </c-submenu>
      </template>
    </c-menu>
  </c-popover>
</template>

<script>
export default {
  props: {
    title: [String],
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isShowdropdown: false
    }
  },
  methods: {
    select(item) {
      console.log(item, 'item')
      this.$emit('select', item)
      this.$refs.dropmenu.close('00000')
    }
  }
}
</script>

<style lang="scss">
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
