<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-09-02
-->
<template>
  <div>
    <c-dropdown
      v-if="options.length>1"
      @visible-change="isShowdropdown=!isShowdropdown"
      @command="handleCommand">
      <c-button :type="btnType" class="btn-dropdown" size="small" :disabled="disabled">{{ text }}<i :class="{'c-icon-arrow-down':true,'dropdown-active-arrow':!isShowdropdown}"></i></c-button>
      <c-dropdown-menu slot="dropdown" class="asset-add-dropdown-menu">
        <c-dropdown-item
          v-for="item in options"
          :key="item.value"
          :command="item.value"
        >{{ item.label }}</c-dropdown-item>
      </c-dropdown-menu>
    </c-dropdown>
    <c-button v-else :type="btnType" class="btn-dropdown" size="small" :disabled="disabled" @click="clickBtn">{{ text }}</c-button>
  </div>
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
      default: ''
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
    },
    clickBtn() {
      this.$emit('command', this.options[0].value)
    }
  }
}
</script>

<style lang="scss">
.asset-add-dropdown-menu{
  min-width: 100px;
}
.btn-dropdown{
  position: relative;
  background: #EBF9FF;
  color: #36A4FF;
  border-color: #EBF9FF;
}
 .c-icon-arrow-down{
   margin-left: 8px;
   transform:rotate(180deg) ;
   transition:transform 0.2s linear;
   &.dropdown-active-arrow{
      transform:rotate(0deg);
      transition:transform 0.2s linear;
    }
 }
</style>
