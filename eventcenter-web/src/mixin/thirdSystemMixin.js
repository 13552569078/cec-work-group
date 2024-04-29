import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'

export default {
  data() {
    return {
      treeProps: {
        label: 'platformName',
        children: 'children'
      },
      selectedThirdSystem: {},
      filterStatus: false
    }
  },
  computed: {
    thirdSystemList() {
      const result = this.$store.getters.getThirdSystemList.filter(item => item.platformStatus)
      return result
    }
  },
  created() {
    // 左侧菜单树
    this.getLeftTree()
  },

  methods: {
    // 获取左侧菜单树
    getLeftTree() {
      moduleSrv.getPlatformInfoList({
        pageNum: 1,
        pageSize: 999,
        sourcePlatform: this.sourcePlatform,
        handlePlatform: this.handlePlatform
      }).then(res => {
        if (res.code === SUCCESS_CODE) {
          this.$store.commit('dispatch/SET_THIRD_SYSTEM_LIST', res.data.list.map(item => {
            item.dictLabel = item.platformName
            item.dictValue = item.platformCode
            item.dictDesc = item.platformName
            item.value = item.platformCode
            return item
          }))
          this.$nextTick(() => {
            if (this.$refs.tree && this.thirdSystemList.length) {
              this.$refs.tree.setCurrentKey(this.thirdSystemList[0].platformCode)
              this.selectedThirdSystem = this.thirdSystemList[0]
            }
          })
        }
      })
    },
    handleNodeClick(data, node) {
      console.log(data, node)
      this.selectedThirdSystem = data
    }
  }
}

