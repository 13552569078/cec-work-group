<template>
  <div class="strategy-config-third-type">
    <div class="search-tree">
      <!-- 需要添加内部滚动 -->
      <el-scrollbar style="height: 100%">
        <cestc-tree
          ref="cestcTreeRef"
          :data="thirdSystemList"
          check-strictly
          node-key="platformCode"
          :highlight-current="true"
          :props="treeProps"
          :expand-all="true"
          icon-class-fold="el-icon-caret-right"
          icon-class-unfold="el-icon-caret-bottom"
          @handleNodeClick="handleNodeClick"
        />
      </el-scrollbar>
    </div>
    <div class="content-right">
      <thirdInterface :third-system-list="thirdSystemList" :selected-third-system="selectedThirdSystem" @changeTreeSelect="changeTreeSelect" />
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'
import thirdInterface from '@/views/third-system-manage/third-interface/interface/index.vue'

export default {
  name: 'ThirdType',
  components: {
    thirdInterface
  },
  data() {
    return {
      treeProps: {
        label: 'platformName',
        children: 'children'
      },
      statusList: [
        {
          type: 1,
          key: 'sourcePlatform',
          label: '来源'
        },
        {
          type: 2,
          key: 'handlePlatform',
          label: '处置'
        }
      ],
      selectedThirdSystem: {}
    }
  },
  computed: {
    thirdSystemList() {
      return [{ platformName: '全部系统', platformCode: '-999', children: this.$store.getters.getThirdSystemList }]
    }
  },
  created() {
    // 左侧菜单树
    this.getLeftTree()
  },

  methods: {
    // 获取左侧菜单树
    getLeftTree() {
      moduleSrv.getPlatformInfoSelect().then(res => {
        if (res.code === SUCCESS_CODE) {
          this.$store.commit('dispatch/SET_THIRD_SYSTEM_LIST', res.data.map(item => {
            item.dictLabel = item.platformName
            item.dictValue = item.platformCode
            return item
          }))
          this.$nextTick(() => {
            if (this.$route?.query?.platformCode) {
              const curNode = this.thirdSystemList[0].children.find(e => e.dictValue === this.$route?.query?.platformCode)
              this.changeTreeSelect(curNode)
            } else {
              this.changeTreeSelect({ platformName: '全部系统', platformCode: '-999' })
            }
          })
        }
      })
    },
    handleNodeClick(data, node) {
      console.log(data, node)
      this.selectedThirdSystem = data
    },
    changeTreeSelect(res) {
      this.$refs.cestcTreeRef.setCurrentKey(res.platformCode)
      this.handleNodeClick(res, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.strategy-config {
  &-third-type {
    display: flex;
    .search-tree {
      flex: 0 0 272px;
      width: 272px;
      margin: 0 20px 0 0;
      .el-scrollbar {
        background-color: $white;
      }
    }
    .content-right {
      flex: 1;
      width: calc(100% - 292px);
      overflow-y: auto;
    }
    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: auto;
      }
      .el-tree-node__expand-icon {
        font-size: 16px;
      }
      .el-tree-node__expand-icon.expanded:before {
        color: #4b4b4b;
      }
    }

  }
}
</style>
