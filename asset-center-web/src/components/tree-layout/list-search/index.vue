<!--
 * @Description: 列表搜索项
 * @Author: zs
 * @Date: 2022-01-24
-->
<script>
import PubSub from 'pubsub-js'
export default {
  name: '',
  components: {
  },
  props: {
    pubsubKey: {
      type: [String, Number],
      default: Math.random()
    }
  },
  data() {
    return {
      myObserver: null,
      simpleOptions: [],
      btnOpen: 0, // 0 不显示  1 底部  2 右侧
      searchForm: {
      },
      searchType: 1, // 1 简单搜索  2 高级搜索
      simpleOptionVal: '',
      fromDataMap: {}
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.init(this.$scopedSlots.header(this)[0])
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
          // // console.log('大小位置 contentRect', entry.contentRect)
          // // console.log('监听的DOM target', entry.target)
          if (entry.target.className.indexOf('list-page_header') !== -1) {
            // 执行内容区的高度变动
            this.setListContentHeight(entry.contentRect.height)
          }
        })
      })
      this.myObserver.observe(this.$el)
    },
    setListContentHeight(val) {
      PubSub.publish(this.pubsubKey, { type: 'changeHeight', value: val })
      this.$emit('changeHeight', val)
    },
    allItemRender(vnode) {
      return vnode
    },
    init(slot) {
      slot.componentOptions.children.forEach(item => {
        // console.log(item.componentOptions.children[0].data.model, 'item.componentOptions.children[0].data.model')
        const i = {
          value: item.componentOptions.children[0].data.model.expression,
          label: item.componentOptions.propsData.label
        }

        this.simpleOptions.push(i)
        this.fromDataMap[i.value] = item
        this.$set(this.searchForm, item.componentOptions.children[0].data.model.expression.split('.')[1], '')
      })

      if (this.simpleOptions[0]) {
        this.simpleOptionVal = this.simpleOptions[0].value
      }
    },
    simpleOptionRender() {
      // console.log('simpleOptionRender')
      return (
        <c-select
          value={this.simpleOptionVal}
          onInput= {(val) => { this.simpleOptionVal = val }}
          style='width: 168px; margin-right: 8px;'
          size='small'
          specific-suffix={true}
          on-change={this.simpleOptionChange}
          placeholder='请选择'
        >
          {
            this.simpleOptions.map(i => {
              return (
                <c-option
                  key={i.value}
                  label={i.label}
                  value={i.value}>
                </c-option>
              )
            })
          }
        </c-select>
      )
    },
    simpleOptionChange(val) {
      // console.log('simpleOptionChange')
      Object.keys(this.searchForm).forEach(k => {
        if ('searchForm.' + k !== val) {
          this.searchForm[k] = ''
        }
      })
    },
    formItemRender(h, v_node) {
      // console.log('formItemRender', v_node)
      if (v_node) {
        return (
          <c-form-item
            label=''
            class={{
              'search-form-field': true,
              'search-form-field-1': true
            }}
          >
            { v_node.componentOptions.children[0] }
          </c-form-item>
        )
      } else {
        return ''
      }
    },
    runSearch() {
      // console.log('------')
      // 对外抛事件
      // if (this.searchType === 1) {
      //   Object.keys(this.searchForm).forEach(k => {
      //     if (this.simpleOptionVal !== 'searchForm.' + k) {
      //       this.searchForm[k] = ''
      //     }
      //   })
      // }
      const arr = []
      Object.keys(this.searchForm).forEach(k => {
        let getIt = false
        if (this.searchType === 1) {
          if (this.simpleOptionVal !== 'searchForm.' + k) {
            this.searchForm[k] = ''
          } else if (this.searchForm[k] && this.searchForm[k] !== '' && this.searchForm[k].length) {
            getIt = true
          }
        } else {
          if (this.searchForm[k] && this.searchForm[k] !== '' && this.searchForm[k].length) {
            // 有值
            getIt = true
          }
        }

        if (getIt) {
          arr.push({
            key: k,
            valueName: '',
            value: this.searchForm[k],
            label: this.getSearchLabel(k)
          })
        }
      })
      // console.log('dddddddarr', arr)
      this.$emit('search', arr)
      PubSub.publish(this.pubsubKey, { type: 'search', value: arr })
      if (arr.length) {
        // console.log('ddddddd')

        this.resetSearch()
      }
    },
    getSearchLabel(key) {
      let str = ''
      this.simpleOptions.forEach(item => {
        if (item.value === 'searchForm.' + key) {
          str = item.label
        }
      })
      return str
    },
    resetSearch() {
      Object.keys(this.searchForm).forEach(k => {
        this.searchForm[k] = ''
      })
      if (this.simpleOptions[0]) {
        this.simpleOptionVal = this.simpleOptionVal || this.simpleOptions[0].value
      }
    },
    setSearchType() {
      this.searchType = this.searchType === 1 ? 2 : 1
      this.resetSearch()

      this.btnOpen = 0
      this.$nextTick(() => {
        this.setBtnsPosition()
      })
    },
    setBtnsPosition() {
      if (this.$el.offsetWidth - this.$refs['form-box'].$el.offsetWidth > 400) {
        this.btnOpen = 2
      } else {
        this.btnOpen = 1
      }
    }
  },
  render(h) {
    const slot = this.$scopedSlots.header(this)[0]
    return (

      <div class='list-page_header'>
        <div class='search-form-wrap'>
          <c-form
            class='search-form-box'
            ref='form-box'
            label-width={this.searchType === 1 ? '0px' : '70px'}
            inline
          >

            {this.searchType === 1 ? this.simpleOptionRender() : ''}
            {
              slot.componentOptions.children.map(item => {
                // return this.allItemRender(item)
                if (this.searchType === 1) {
                  if (item.componentOptions.children[0].data.model.expression === this.simpleOptionVal) {
                    return this.formItemRender(h, item)
                  } else {
                    return ''
                  }
                } else {
                  return item
                }
              })
            }
            <div
              v-show={this.searchType === 1}
              class={{
                'search-btns-box': true
              }}
            >
              <c-button type='gradual' size='small' on-click={ this.runSearch } >查询</c-button>
              <span class='search-type' on-click={ this.setSearchType }>高级搜索</span>
            </div>
          </c-form>
          <div
            v-show={this.searchType === 2}
            class={{
              'search-btns-box-1': this.btnOpen === 1,
              'search-btns-box-2': this.btnOpen === 2
            }}
          >
            <c-button type='ordinary' size='small' on-click={ this.resetSearch }>重置</c-button>
            <c-button type='gradual' size='small' on-click={ this.runSearch }>查询</c-button>
            <span class='search-type' on-click={ this.setSearchType }>简易搜索</span>
          </div>
        </div>
      </div>
    )
  }
}
</script>

<style scoped lang='scss'>
.list-page_header {
    position: relative;
    box-sizing: border-box;
    background: #FFFFFF;
    min-height: 72px;
    padding: 0 20px;
    .header-line {
      width: 100%;
      height: 1px;
      background: #45ABFF;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .search-form-wrap {
  position: relative;
  padding-top: 20px;
  .search-form-box {
    display: inline;
  }
  .search-type {
    color: #4B4B4B;
    margin-left: 16px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      color: #36A4FF;
    }
  }
  .search-btns-box {
    display: inline-block;
  }
  .search-btns-box-1 {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
  }
  .search-btns-box-2 {
    position: absolute;
    right: 0;
    top: 20px;
  }
}

.search-form-field {
  padding-bottom: 20px;
  margin-right: 24px;

  &::before {
    content: attr(label);
    margin-right: 16px;
    color: #4B4B4B;
    font-size: 14px;
    white-space:nowrap;
  }
  &.c-form-item {
    margin-bottom: 0;
  }
  ::v-deep .c-input, .c-select, .c-date-editor--daterange.c-input__inner, .c-date-editor--datetimerange.c-input__inner  {
    width: 296px;
  }
}
.search-form-field-1 {
  ::v-deep .c-input, .c-select, .c-date-editor--daterange.c-input__inner, .c-date-editor--datetimerange.c-input__inner  {
    width: 400px;
  }
}

</style>
