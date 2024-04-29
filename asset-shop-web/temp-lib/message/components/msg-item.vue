<!-- 消息的条目
 * @Description:
 * @Author: wyh19
 * @Date: 2020-09-18
-->
<template>
  <div class="msg-item" :class="{'is-even':isEven,'is-hovering':isHovering}"
       @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <p :style="{cursor:detailType != 0?'pointer':'text'}" @click="handleRead">
      <c-tooltip :open-delay="500" popper-class="msg-tooltip" placement="top"
                 :disabled="detailType != 0">
        <p slot="content" v-html="content"></p>
        <span :style="{color:status==0?'#404040':'#9B9B9B'}" v-html="content"></span>
      </c-tooltip>
    </p>
    <span>{{ date }}</span>
    <i v-if="isHovering" class="c-icon-delete" @click="handleDelete" />
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: 0
    },
    isEven: {
      type: Boolean,
      default: false
    },
    detailType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isHovering: false
    }
  },
  methods: {
    handleRead() {
      this.$emit('read')
    },
    handleDelete() {
      this.$emit('delete')
    }
  }
}
</script>

<style scoped lang="scss">
.msg-item {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  p {
    flex: 1;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  span {
    font-size: 14px;
    flex: 0 0 146px;
    margin-left: 22px;
    color: #9b9b9b;
  }
  i {
    flex: 0 0 20px;
    margin-left: 16px;
    font-size: 14px;
    color: #9b9b9b;
    cursor: pointer;
  }
}
.msg-item.is-even {
  background: #fafafa;
}
.msg-item.is-hovering {
  background: #f2f3f8;
}
.msg-item-tool {
  flex: 0 0;
}
</style>
<style>
.msg-tooltip {
  max-width: 40vw;
}
</style>
