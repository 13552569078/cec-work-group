<!--
 * @Description: 带有树的左右布局
 * @Author: liu lianpeng
 * @Date: 2021-05-06
-->

<script>
import PubSub from 'pubsub-js'

import listSearch from './list-search'
import searchItems from './search-items'
export default {
  name: 'CtreeLayout',
  components: { listSearch, searchItems },

  props: {
    initTags: { // 初始显示的搜索条件
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     * 下拉选、多级、树等选项列表
     * [{
     *  key:assetTags,
     *  value:[{}]
     * }]
     */
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    showTree: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      rightWidth: 'calc(100% - 288px)',
      searchForm: {},
      searchTags: [], // 搜索条件标签
      pubsubKey: 'tree-layout' + Math.random(),
      tagBoxHeight: 0,
      tableHeight: 0,
      myObserver: null
    }
  },
  watch: {

  },
  mounted() {
    if (!this.showTree) {
      this.rightWidth = '100%'
    }
    this.searchTags = [...this.initTags]
    this.makeSearchForm(this.searchTags)

    PubSub.subscribe(this.pubsubKey, this.pubsubHandel)
    this.runResizeObserver()
  },
  beforeDestroy() {
    this.myObserver && this.myObserver.disconnect()
  },
  methods: {
    runResizeObserver() {
      this.myObserver = new ResizeObserver(entries => {
        // 注意，entres是个数组，数组项为每个需要监听的DOM节点
        entries.forEach(entry => {
          // // console.log('监听的DOM target', entry.target, entry.target.className)
          // // console.log('大小位置 contentRect', entry.contentRect)
          if (entry.target.className.indexOf('c-tree-layout') !== -1) {
            // 执行内容区的高度变动
            this.setTableHeight()
          }
        })
      })
      this.myObserver.observe(this.$el)
    },
    makeSearchForm(val) {
      // console.log('makeSearchForm', val)
      Object.keys(this.searchForm).forEach(key => {
        this.searchForm[key] = null
      })
      // 更改搜索内容
      if (val.length) {
        val.forEach(item => {
          this.searchForm[item.key] = item.value
        })
      }
    },
    makeSearchTags(arr) {
      // console.log(arr, 'makeSearchTags')
      // 处理搜素标签  修改  新增
      arr.forEach(item => {
        let hasIt = false
        this.searchTags.forEach(t => {
          // console.log(t.key === item.key, t.key, item.key, 't.key === item.key')
          if (t.key === item.key) {
            // 更新
            t.valueName = this.getValName(item)
            t.value = item.value
            hasIt = true
          }
        })
        if (!hasIt) {
          // 新增
          this.searchTags.push({
            key: item.key,
            valueName: this.getValName(item),
            value: item.value,
            label: item.label
          })
        }
      })
    },
    getValNameFromTreeArray(val, arr = [], res = []) {
      if (Array.isArray(val)) {
        for (let valIndex = 0; valIndex < val.length; valIndex++) {
          const valItem = val[valIndex]
          const findOne = arr.find(item => item.groupId + '' === valItem + '')
          if (findOne) {
            res.push(findOne.groupName)
          } else {
            for (let index = 0; index < arr.length; index++) {
              const element = arr[index]
              if (element.childList && element.childList.length) {
                this.getValNameFromTreeArrayByOne(valItem, element.childList, res)
              }
            }
          }
        }
      } else {
        this.getValNameFromTreeArrayByOne(val, arr, res)
      }
      return res
    },
    getValNameFromTreeArrayByOne(val, arr, res = []) {
      const findOne = arr.find(item => item.groupId + '' === val + '')
      if (findOne) {
        res.push(findOne.groupName)
      } else {
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index]
          if (element.childList && element.childList.length) {
            this.getValNameFromTreeArrayByOne(val, element.childList, res)
          }
        }
      }
    },
    // 获取值的真实显示数据
    getValName(item) {
      // console.log(item, 'getValName')
      // 特殊需要换取展示值的进行处理
      const findOne = this.options.find(_item => item.key === _item.key)
      if (findOne) {
        if (findOne.isTime) {
          return item.value.join(findOne.separator || ',')
        }
        if (Array.isArray(item.value)) {
          // console.log(findOne.value, 'ddddresddd ')
          return this.getValNameFromTreeArray(item.value, findOne.value || []).join(findOne.separator || ',')
        } else {
          const res = []
          this.getValNameFromTreeArrayByOne(item.value, findOne.value || [], res)
          // console.log(res, 'ddddres ')
          return res.join(findOne.separator || ',')
        }
      } else {
        return item.value
      }
    },

    pubsubHandel(key, data) {
      // console.log(data, 'datadddddd')
      switch (data.type) {
        case 'search':
          this.search(data.value)
          break
        case 'changeHeight':
          this.changeTableHeight(data.value)
          break
        case 'clearTags':
          this.clearTags(data.value)
          break
        case 'tagBoxHeight':
          this.changeTagBoxHeight(data.value)
          break

        default:
          break
      }
    },
    changeTagBoxHeight(val) {
      this.tagBoxHeight = val
      this.setTableHeight()
    },
    changeTableHeight(val) {
      this.tableHeight = val
      this.setTableHeight()
    },
    setTableHeight() {
      // console.log('settableheight', this.tableHeight, this.tagBoxHeight)
      // 计算表格高度
      this.$emit('contentHeightChange', this.tableHeight + this.tagBoxHeight - 8)
      this.$emit('getHeaderHeight', this.tableHeight + this.tagBoxHeight - 8)
    },
    search(val) {
      // 更改搜索内容
      // Object.keys(this.searchForm).forEach(key => {
      //   this.searchForm[key] = null
      // })
      // console.log(val, ' search(val)')
      if (val.length) {
        val.forEach(item => {
          this.searchForm[item.key] = item.value
        })
      }
      // 执行搜索
      this.getSearch(val)
    },
    getSearch(val) {
      this.makeSearchTags(val)

      // console.log('获取到搜索内容', this.searchForm)
      this.$emit('getSearch', this.searchForm)
      this.$emit('cacheTags', this.searchTags)
    },
    clearTags(val) {
      // console.log(val, 'clearTags')
      // 需要清除的搜索项
      this.searchTags = this.searchTags.filter(i => {
        const tags = val.filter(j => {
          return j.key === i.key
        })
        return !tags.length
      })
      this.makeSearchForm(this.searchTags)
      this.$emit('getSearch', this.searchForm)
      this.$emit('cacheTags', this.searchTags)
    }
  },
  render(h) {
    const treeLayoutSlotHeader = this.$scopedSlots.header
    const contentHeader_left = this.$scopedSlots['content-header_left']
    const contentHeader_right = this.$scopedSlots['content-header_right']
    return (

      <div class='c-tree-layout'>
        <section v-show={this.showTree} class='left-section-tree'>
          {this.$slots.tree}
        </section>
        <section class='tree-layout-right' style={'width: ' + this.rightWidth + ';'}>
          <div class='search-box'>
            <listSearch
              pubsubKey={this.pubsubKey}
              scopedSlots={
                {
                  header: treeLayoutSlotHeader
                }
              }
            >
            </listSearch>
          </div>
          <div slot='content' class='tree-page-content'>
            <searchItems
              pubsubKey={this.pubsubKey}
              tags={this.searchTags}
              scopedSlots={
                {
                  'content-header_left': contentHeader_left,
                  'content-header_right': contentHeader_right
                }
              }
            >
            </searchItems>
            {this.$slots.table}
            {this.$slots.footer}
          </div>
        </section>
      </div>

    )
  }
}
</script>
<style lang="scss" scoped>
.c-tree-layout {
  height: 100%;
  display: flex;
  .left-section-tree {
    width: 272px;
    height: 100%;
    margin-right: 16px;
    background: #FFFFFF;
  }
  .tree-layout-right {
    display: flex;
    flex-direction: column;
    .search-box{
      background-color: #FFFFFF;
    }
    .tree-page-content{
      background-color: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      padding: 0px 20px 76px;
      margin-top: 16px;
    }
    .table-body {
      padding: 0px 24px 16px;
    }
  }
  &::after{
    content: '';
    clear: both;
  }
}

</style>
