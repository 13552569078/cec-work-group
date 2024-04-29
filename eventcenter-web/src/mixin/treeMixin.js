import moduleSrv from '@/api/dispatch'

export default {
  data() {
    return {
      gridTreeData: [],
      treeLoad: false,
      orgId: '',
      isLeaf: false,
      defaultExpandedKeys: [],
      lazyLoad: true
    }
  },
  created() {
    if (!this.lazyLoad) {
      this.getZzdList()
    }
  },
  methods: {
    getZzdList() {
      this.treeLoad = true
      moduleSrv.getZzdList().then(res => {
        this.gridTreeData = [res.data]
        this.orgId = this.gridTreeData[0].id
        this.defaultExpandedKeys.push(this.gridTreeData[0].id)
      }).finally(() => {
        this.treeLoad = false
      })
    },

    handleNodeClick(data) {
      const { id } = data
      this.orgId = id
      console.log('data==', data)
      if (data.children) {
        this.isLeaf = true
      }
    },

    async loadNode(node, resolve) {
      console.log('node===', node)
      if (node.level === 0) {
        // const resq = await moduleSrv.getZzdList()
        // console.log('resq==', resq);
        // resolve([resq.data])
      }
      if (node.level > 1) {
        console.log('node==', node)
      }
    }
  }
}
