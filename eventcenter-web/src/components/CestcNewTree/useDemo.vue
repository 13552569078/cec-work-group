<template>
  <div class="grid-draw-box">
    <!-- 核心 props node-id, tree-data：树总数据，核心 parent-id：树父节点id对应的字段名，核心 group-id：树层组id对应的字段名-->
    <cestc-new-tree
      :tree-data="gridTreeData"
      node-id="id"
      parent-id="parentId"
      group-id="groupId"
      :props="{label: 'name', children: 'children'}"
      icon-class-fold="el-icon-caret-right"
      icon-class-unfold="el-icon-caret-bottom"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      highlight-current
      @node-click="handleNodeClick"
    >
      <div slot-scope="{ slotScope: { node, data } }" class="custom-tree-node">
        <span class="cus-label" @click="aaaaa(node)">{{ data.name }}</span>
      </div>
    </cestc-new-tree>
  </div>
</template>
<script>
import moduleSrv from '@/api/grid'
import cestcNewTree from '@/components/CestcNewTree/index.vue'
export default {
  name: 'Usename',
  components: {
    cestcNewTree
  },
  data() {
    return {
      gridTreeData: []
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    getTree() {
      this.treeLoad = true
      moduleSrv.getGridTree().then(res => {
        this.gridTreeData = res.data || []
        this.treeLoad = false
      }).catch(() => {
        this.treeLoad = false
      })
    },
    aaaaa(node) {
      console.log('node:', node)
    },
    handleNodeClick(nodedata) {
      // alert(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-draw-box {
  height: 100Vh;
}
</style>
