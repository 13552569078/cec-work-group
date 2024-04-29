<!--
 * @description 事件处理--转派郑郑订
 * @date 2020-09-30
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="通讯录"
    width="618px"
    top="20vh"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <div class="tree-wrapper">
      <el-input v-model="filterText" placeholder="请输入" class="tree-search">
        <el-button slot="append" icon="el-icon-search" @click.stop="_toSearch" />
      </el-input>
      <el-tree
        ref="tree"
        :filter-node-method="filterNode"
        node-key="id"
        lazy
        :load="loadNode"
        :props="{label: 'name', children: 'children', isLeaf: 'leaf'}"
        icon-class-fold="el-icon-caret-right"
        icon-class-unfold="el-icon-caret-bottom"
        element-loading-spinner="el-icon-loading"
        highlight-current
        @node-click="handleNodeClick"
      />
    </div>
  </cestc-dialog>
</template>
<script>
// import cestcNewTree from '@/components/CestcNewTree/index.vue'
import moduleSrv from '@/api/dispatch'

export default {
  name: 'ToZzdDialog',
  components: {
    // cestcNewTree
  },
  props: {
    taskId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  methods: {
    _toSearch() {
      this.$refs.tree.filter(this.filterText)
    },
    filterNode(value, data) {
      if (!value) return true
      const label = 'name'
      return data[label] && data[label].indexOf(value) !== -1
    },
    handleNodeClick(data) {
      const { id } = data
      this.orgId = id
      console.log('data==', data)
    },
    async loadNode(node, resolve) {
      // console.log('node===', node);
      if (node.level === 0) {
        const resq = await moduleSrv.getZzdList()
        // 重组，把人数总数添加name 属性
        resolve([resq.data].map(item => {
          // item.name += ` (${item.count || 0})`
          return item
        }))
      }
      if (node.level >= 1) {
        // debugger
        const { id } = node.data
        const resq = await moduleSrv.getZzdList({ orgId: id })
        if (resq.data.children.length) {
          const orgGroup = resq.data.children || []
          let userVOList = resq.data.userVOList || []
          // 组织下有可以直接挂人，如果有的话，也需要进行合并
          if (userVOList.length) {
            userVOList = userVOList.map(item => {
              this.$set(item, 'leaf', true)
              if (!item.name) {
                item.name = '--'
              }
              return item
            })
          }
          resolve(orgGroup.concat(userVOList))
        } else {
          // 到叶子节点了，取节点下的userVOList
          const data = resq.data.userVOList || []
          resolve(data.map(item => {
            this.$set(item, 'leaf', true)
            if (!item.name) {
              item.name = '--'
            }
            return item
          }))
        }
      }
    },

    // 提交的时候，需要重组数据结构向上返回
    _confirm() {
      console.log('node ===', this.$refs.tree.getCurrentNode())
      try {
        const node = this.$refs.tree.getCurrentNode()
        if (node.zzdAccountId) {
          const { id, name = '', username = '', zzdAccountId = '' } = node
          this.$emit('confirm', {
            name,
            userId: id,
            username,
            zzdAccountId
          })
        } else {
          this.$message.warning('该人员没有郑政钉相关账号')
        }
      } catch (error) {
        this.$message.warning('请先选择人员')
      }
    },
    // 取消关闭弹窗
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-wrapper {
  height: 50vh;
  overflow-y: auto;
}
</style>
