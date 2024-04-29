<!--
 * @Description: 搜索项标签展示区
 * @Author: zs
 * @Date: 2022-01-20
-->
<template>
  <div class="list-page_content">
    <div class="content-header">
      <div class="content-header_left_wrap">
        <slot name="content-header_left"></slot>
      </div>
      <!--搜索项显示区1-->
      <div ref="search-tags" class="content-header_middle_wrap">
        <search-tag
          :tags="tags"
          :show-type="'limit'"
          :box-width="searchTagsW"
          @hideIt="judgeSearchTagHide"
          @clearEvent="clearSearchTag"
        ></search-tag>
      </div>
      <div class="content-header_right_wrap">
        <slot name="content-header_right"></slot>
      </div>
    </div>
    <!--搜索项显示区2-->
    <search-tag
      v-if="searchTagHide"
      :tags="tags"
      :show-type="'all'"
      @clearEvent="clearSearchTag"
    ></search-tag>
  </div>
</template>
<script>

import searchTag from './search-tag.vue'
import PubSub from 'pubsub-js'

export default {
  components: {
    searchTag
  },
  props: {
    pubsubKey: {
      type: [String, Number],
      default: Math.random()
    },
    // from 的 item 数据
    tags: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      searchTagHide: false,
      myObserver: null,
      searchTagsW: 0
    }
  },
  mounted() {
    this.runResizeObserver()
  },
  beforeDestroy() {
    this.myObserver && this.myObserver.disconnect()
  },
  methods: {
    judgeSearchTagHide(val) {
      this.searchTagHide = val
    },
    clearSearchTag(val) {
      // 关闭的搜素标签
      if (val === 'all') {
        PubSub.publish(this.pubsubKey, { type: 'clearTags', value: this.tags })
        this.$emit('clearTags', this.tags)
      } else {
        PubSub.publish(this.pubsubKey, { type: 'clearTags', value: [val] })
        this.$emit('clearTags', [val])
      }
    },

    runResizeObserver() {
      this.myObserver = new ResizeObserver(entries => {
        // 注意，entres是个数组，数组项为每个需要监听的DOM节点
        entries.forEach(entry => {
          // // console.log('大小位置 contentRect', entry.contentRect)
          // // console.log('监听的DOM target', entry.target)
          if (entry.target.className.indexOf('content-header_middle_wrap') !== -1) {
            this.searchTagsW = entry.contentRect.width
          } else if (entry.target.className.indexOf('list-page_content') !== -1) {
            this.$emit('tagBoxHeight', entry.contentRect.height)
            PubSub.publish(this.pubsubKey, { type: 'tagBoxHeight', value: entry.contentRect.height })
          }
        })
      })
      this.myObserver.observe(this.$refs['search-tags'])
      this.myObserver.observe(this.$el)
    }
  }
}
</script>

<style scoped lang='scss'>

  .list-page_content {
    position: relative;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 20px;

    background: rgba(255, 255, 255, 0.45);

    box-sizing: border-box;
    border: 1px solid #FFFFFF;
    border-top: 0px;

  }
  .content-header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    .content-header_middle_wrap {
      flex: 1;
      padding: 0 24px;
    }
    .content-header_left_wrap {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }

</style>
