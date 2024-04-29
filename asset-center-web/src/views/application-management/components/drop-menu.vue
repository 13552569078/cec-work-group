<template>
  <div>
    <c-dropdown v-if="children.length>=2" :hide-on-click="false" @command="open">
      <span class="c-dropdown-link">
        {{ title }}<i class="c-icon-arrow-down c-icon--right"></i>
      </span>
      <c-dropdown-menu slot="dropdown">
        <c-dropdown-item v-for="item in children" :key="item.value" :command="item">{{ item.title }}</c-dropdown-item>
      </c-dropdown-menu>
    </c-dropdown>
    <div v-else class="btn-only" @click="open(children[0])">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    children: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    open(item) {
      this.$emit('open', item)
    }
  }
}
</script>

<style lang="scss" scoped>
 .c-dropdown-link {
    cursor: pointer;
    color: #36A4FF;
    padding: 4px 8px !important;
    margin-left: 12px;
  }
  .c-dropdown-link:hover{
    .c-icon-arrow-down{
      transform: rotate(180deg);
    }
  }
  .c-icon-arrow-down {
    font-size: 12px;
  }
.btn-only{
  padding: 4px 8px;
  margin-left: 12px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  text-align: center;
  letter-spacing: 0em;

  /* 状态色/primary */
  color: #36a4ff;
  cursor: pointer;
}
</style>
