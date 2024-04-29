<template>
  <div class="tree">
    <el-input v-model="filterText" class="tree-input" placeholder="请输入" clearable>
      <template slot="append">
        <img src="../../../assets/search.png">
      </template>
    </el-input>
    <div class="person">
      <div class="person-header" @click="openOrcloseTree()">
        <i v-if="personStatus" class="el-icon-caret-bottom" />
        <i v-else class="el-icon-caret-right" />
        <div class="title">全部</div>
      </div>
      <div v-if="personStatus" class="person-list">
        <ul
          v-infinite-scroll="eventIncrementLoad"
          infinite-scroll-disabled="eventLoadFinished"
          class="list-ul"
        >
          <li v-for="(item, index) in filterDeptTree" :key="index">
            <img
              v-if="clickNode.id === item.id"
              src="../../../assets/svg/daohang-zhibanbiaohover.svg"
              alt=""
              class="person-img"
            >
            <img
              v-else
              src="../../../assets/svg/daohang-zhibanbiao.svg"
              alt=""
              class="person-img"
            >
            <span
              class="person-item"
              :class="{ 'default-click': clickNode.id === item.id }"
              @click="nodeClick(item)"
            >{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'WorkTree',
  data() {
    return {
      deptTree: [], // 机构树
      filterDeptTree: [],
      filterText: '',
      personStatus: true, // false关闭
      pageNum: 1,
      eventLoadFinished: false,
      firstLoadEnd: false,
      clickNode: '',
      pageSize: 12
    }
  },
  watch: {
    filterText: {
      handler(nVal) {
        this.filterDeptTree = this.deptTree.filter(
          (item) => item.name.indexOf(nVal) !== -1
        )
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.resultList()
  },
  methods: {
    eventIncrementLoad() {
      if (!this.firstLoadEnd) return
      this.pageNum += 1
      this.getNextPage()
    },
    openOrcloseTree() {
      this.personStatus = !this.personStatus
    },
    nodeClick(data) {
      this.clickNode = data
      this.$emit('nodeClick', data)
    },
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 树
    resultList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: 0
      }
      moduleSrv.getDutyList(params).then((res) => {
        const { list = [], isLastPage = false } = res.data
        if (res.code === SUCCESS_CODE) {
          this.deptTree = list
          this.clickNode = this.deptTree[0]
          this.filterDeptTree = list
          this.eventLoadFinished = isLastPage
          this.$emit('nodeClick', this.deptTree[0])
          this.firstLoadEnd = true
        }
      })
    },
    getNextPage() {
      if (this.eventLoadFinished) return
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: 0
      }
      moduleSrv.getDutyList(params).then((res) => {
        const { list = [], total = 0, isLastPage = false } = res.data
        if (res.code === SUCCESS_CODE) {
          this.deptTree = this.deptTree.concat(list)
          this.filterDeptTree = this.deptTree
          console.log(this.deptTree.length, total, isLastPage)
          this.eventLoadFinished = isLastPage
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tree {
  height: 100%;
  overflow-y: auto;
  font-size: 14px;
  color: #4b4b4b;
  background: #fff;
  padding: 20px;
  .tree-input {
    margin-bottom: 20px;
    ::v-deep {
      .el-input-group__append {
        border-left: 0;
        padding: 0 7.5px;
        background: #f9fafe;
        border: 1px solid #e7e7e7;
        border-radius: 0 2px 2px 0;
        border-left: none;
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
        }
      }
      .el-input__inner {
        border-color: #e7e7e7;
        &:focus {
          border-color: #36a4ff;
        }
      }
    }
  }
  .person {
    height: calc(100% - 60px);
    overflow: hidden;
    .person-header {
      display: flex;
      cursor: pointer;
      .el-icon-caret-bottom,
      .el-icon-circle-plus-outline {
        cursor: pointer;
        &:hover,
        &:active {
          color: #36a4ff;
        }
      }
      .el-icon-caret-right {
        color: #bdbdbd;
      }
      .title {
        padding: 0 0 0 10px;
        width: 100%;
      }
    }
    .person-list {
      padding: 10px 0 0 20px;
      height: calc(100% - 40px);
      overflow-y: auto;
      .list-ul {
        li {
          // margin-top: 10px;
          display: flex;
          // justify-content: space-between;
          align-items: center;
          height: 40px;
          line-height: 30px;
          width: 200px;
          padding-left: 20px;
          &:hover {
            background: #f9fafe;
          }
          &:active {
            color: #36a4ff;
          }
          .person-img {
            width: 25px;
            height: 25px;
            margin-right: 5px;
          }
          .person-item {
            cursor: pointer;
            padding: 5px 0;
          }
          .default-click {
            color: #36a4ff;
          }
        }
      }
    }
  }
}
</style>
