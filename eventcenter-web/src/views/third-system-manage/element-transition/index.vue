<template>
  <div class="page-config-container">
    <el-tabs v-model="activeName" class="tab-list-own">
      <el-tab-pane v-for="item in menuList" :key="item.code" :label="item.name" :name="item.code" />
    </el-tabs>
    <div class="tree-box" :style="'height: calc(100% - 45px);'">
      <area-code v-if="activeName === 'areaCode'" />
      <source-system-type v-if="activeName ==='sourceSystemType'" />
      <handle-system-type v-if="activeName === 'handleSystemType'" />
    </div>
  </div>
</template>
<script>
import areaCode from './areaCode'
import sourceSystemType from './sourceSystemType'
import handleSystemType from './handleSystemType'
export default {
  name: 'ElementTransition',
  components: {
    areaCode,
    sourceSystemType,
    handleSystemType
  },
  props: {},
  data() {
    return {
      menuList: [
        {
          code: 'areaCode',
          name: '行政区划转换'
        },
        {
          code: 'sourceSystemType',
          name: '来源系统类型转换'
        },
        {
          code: 'handleSystemType',
          name: '处置系统类型转换'
        }
      ],
      activeName: 'areaCode'
    }
  }
}
</script>
<style lang="scss" scoped>
.page-config-container {
  height: calc(100% - 16px);
  width: 100%;

  .tree-box {
    flex: 1
  }

  .empty-box {
    height: calc(100% - 16px);
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
</style>
