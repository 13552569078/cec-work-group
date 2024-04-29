<template>
  <div class="et-search">
    <div class="search-keyword">
      <div class="search-title">
        <img
          class="title-icon"
          src="@/assets/oneQuery/query_title.png"
          alt=""
        >
        <span>一键直查</span>
      </div>
      <div class="key-search">
        <el-input
          v-model="form.keyWord"
          placeholder="请输入"
          @keyup.enter.native="_search"
        >
          <template slot="append">
            <i v-if="showClear" class="clear-icon el-icon-circle-close" @click="clearKeyWord" />
            <img
              src="@/assets/search.png"
              class="img"
              alt=""
              @click="_search"
            ></template>
        </el-input>
      </div>
    </div>
    <div
      v-show="showResult"
      class="tab"
    >
      <span
        v-for="item in KEYWORD_TYPE_OPTIONS"
        :key="item.dictValue"
        :class="{ selected: form.searchType === item.dictValue }"
        @click="changeTab(item.dictValue)"
      >{{ item.dictDesc }}</span>
    </div>
  </div>
</template>

<script>
import speTypeMixin from '@/mixin/speTypeMixin'
import { KEYWORD_TYPE_OPTIONS } from '@/constants'

export default {
  name: 'EventcenterWebSearch',
  components: {},
  mixins: [speTypeMixin],
  props: {
    visibleChange: {
      type: Function,
      default: () => ({})
    },
    showResult: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        keyWord: '',
        searchType: '0',
        gridId: '',
        level: ''
      },
      KEYWORD_TYPE_OPTIONS
    }
  },
  computed: {
    showClear() {
      return this.form.keyWord.length > 0
    }
  },
  methods: {
    changeTab(tab) {
      this.form.searchType = tab
      this._search()
    },
    _reset(noFetch) {
      this.form = {
        keyWord: '',
        searchType: '',
        gridId: '',
        level: ''
      }
      !noFetch && this._search()
    },
    getParams() {
      const params = {}
      for (const key in this.form) {
        params[key] = this.form[key]
      }
      return params
    },
    _search(e) {
      this.$emit('search', true)
    },
    clearKeyWord() {
      this.form.keyWord = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.et-search {
  margin-bottom: 20px;
  .search-keyword {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;

    .search-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 24px;
      font-size: 18px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #4b4b4b;
      line-height: 24px;
      .title-icon {
        margin-right: 9px;
        width: 18px;
      }
    }
    .key-search {
      width: 312px;
      display: flex;
      align-items: center;
      ::v-deep {
        .el-input-group__append {
          width: 32px;
          height: 32px;
          background: #f9fafe;
          border-radius: 0px 2px 2px 0px;
          border: 1px solid #e7e7e7;
          border-left: 0px;
          padding: 0;
          padding-left: 7.5px;
          cursor: pointer;
          img {
            width: 16px;
            height: 16px;
          }
        }
        .clear-icon {
          position: absolute;
          right: 37px;
          top: 6px;
          font-size: 16px;
          cursor: pointer;
          &:hover {
            color: #36a4ff;
          }
        }
      }
    }
  }
  .tab {
    display: flex;
    align-items: center;
    span {
      width: 88px;
      height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4b4b4b;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #e7e7e7;
      cursor: pointer;
      &.selected {
        color: #36a4ff;
        border-color: #36a4ff;
        border-radius: 0px 2px 2px 0px;
      }
    }
  }
}
</style>
