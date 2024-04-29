<!--/*
* @Author: dingli
* @Desc: 选择应用
* @Date: 2022-4-21
*/-->
<template>
  <div class="refer-download-wrap">
    <fixed-page
      class="checkbox-notree"
      padding="0"
      :background-color="'#fff'"
      :header-height="65"
      :header-margin="0"
      :footer-margin="0"
      :footer-height="0"
    >
      <template v-slot:header>
        <div class="header-wrap">
          <div class="left-top">
            <div class="search-item">
              <span style="width:113px">应用上架名称</span>
              <c-input
                v-model="requestData.packName"
                placeholder="请输入"
                clearable
                class="all-input"
                size="small"
              />
            </div>
            <div class="search-item">
              <span>应用类型</span>
              <c-select
                v-model="requestData.assetSubtype" placeholder="请选择"
                class="all-input"
                clearable
                :specific-suffix="true"
              >
                <c-option v-for="item in appTypeList" :key="item.value" :value="item.value" :label="item.label"></c-option>
              </c-select>
            </div>
          </div>
          <div class="right-top">
            <c-button
              type="gradual"
              size="small"
              @click="search"
            >查询</c-button>
          </div>
        </div>
      </template>
      <div class="body-demo">
        <c-table
          ref="multipleTable"
          v-loading="listLoading"
          class="hidden-checkall-header"
          height="319px"
          :data="showList"
          element-loading-text="Loading"
          @selection-change="selectionKpi"
          @select="userClickSelect"
          @select-all="userClickSelect"
        >
          <c-table-column
            type="selection"
            width="50"
          />
          <c-table-column
            label=""
            width="70"
          >
            <template slot-scope="scope">{{ pageData.pageSize*(pageData.currPage-1)+scope.$index+1 }}</template>
          </c-table-column>
          <c-table-column
            label="应用上架名称"
            prop="packName"
            show-overflow-tooltip
          />
          <c-table-column
            label="上架版本号"
            prop="packVersion"
            show-overflow-tooltip
          />
          <c-table-column
            label="应用类型"
            prop="assetSubtype"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ filterAppType(scope.row.assetSubtype) }}
            </template>
          </c-table-column>
          <c-table-column
            label="应用描述"
            prop="packDesc"
            show-overflow-tooltip
          />
          <c-table-column
            label="操作"
            prop=""
            width="70"
          >
            <template slot-scope="scope">
              <span class="view" @click="clickView(scope.row)">查看</span>
            </template>
          </c-table-column>
        </c-table>
        <c-pagination
          style="line-height:normal;padding-top:24px"
          background
          :current-page="requestData.pageNum"
          :page-size="pageData.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pageData.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </fixed-page>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="close">取消</c-button>
      <c-button type="gradual" size="small" @click="clickNext">下一步</c-button>
    </div>
  </div>
</template>
<script>
import { downloadList } from '@/api'
import { getToken } from '@/utils/auth'
export default {
  name: 'ReferDownload',
  props: {
    init: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      listLoading: false,
      requestData: {
        useStatus: 0,
        optType: 1,
        pageNum: 1,
        packType: 2
      },
      pageData: {},
      // 1-APP，2-大屏，3-PC
      appTypeList: [
        // { label: 'APP', value: 1 },
        // { label: '大屏', value: 2 },
        { label: 'PC', value: 3 },
        { label: 'H5', value: 4 }
      ],
      showList: [],
      newSelectList: [],
      newSelectListValue: [],
      selectTotalList: [], // 所有的数组数据
      selectTableList: [],
      changeTotalList: [],
      checkedName: 'id'
    };
  },
  created() {
    this.getList('init')
  },
  methods: {
    filterAppType(key) {
      if (!key) return ''
      key = key.split(',')
      const res = []
      key.forEach(item => {
        res.push((this.appTypeList.find(d => d.value === +item) || {}).label)
      })
      return res.join(',')
    },
    async getList(init) {
      console.log(init, '----------')
      try {
        const res = await downloadList(this.requestData)
        this.showList = res.data.list.map(item => {
          item.id = item.packVersionId + '' + item.referPackVersionId
          return item
        })
        this.pageData = {
          total: res.data.total,
          pageSize: res.data.pageSize,
          currPage: res.data.currPage
        }
        if (init === 'init' && this.init) {
          console.log(this.init)
          this.selectTotalList = [this.init[`${this.checkedName}`]]
          this.selectTableList = [this.init]
          this.renderTotalList()
        }
      } catch (e) {
        // e
        console.log(e)
      }
    },
    search() {
      this.requestData.pageNum = 1
      this.getList()
    },
    clickView(row) {
      // 打开新标签页查看应用快照
      console.log(row)
      if (window.__systemConfig && window.__systemConfig.assetShopUrl) {
        window.open(`${window.__systemConfig.assetShopUrl}templateApp/snapshoot?shopCode=${row.shopCode}&packVersion=${row.packVersion}&packVersionId=${row.packVersionId}`)
      } else {
        this.$message.warning('没有获取到资源商城平台跳转地址，请刷新页面后重试')
      }
    },
    handleCurrentChange(pageNum) {
      this.requestData.pageNum = pageNum
      this.getList()
    },
    close() {
      this.$emit('close')
    },
    clickNext() {
      console.log(this.selectTableList)
      if (!this.selectTableList.length) {
        return this.$message.warning('请选择应用')
      }
      // if (!this.selectTableList[0].packFilePath) {
      //   return this.$message.warning('当前应用没有资源包，请重新选择')
      // }
      this.$emit('next', this.newSelectList)
    },
    selectionKpi(data) {
      this.newSelectList = data
      const newArr = []
      data.map((item) => newArr.push(item[`${this.checkedName}`]))
      this.newSelectListValue = newArr
    },
    userClickSelect(arrs, item) {
      console.log(arrs, item, 'arrs, item')
      if (item) {
        // 监听单个选中
        if (this.selectTotalList.indexOf(item[`${this.checkedName}`]) > -1) {
          // 取消
          this.selectTotalList = []
          this.selectTableList = []
        } else {
          // 选中
          this.selectTotalList = [item[`${this.checkedName}`]]
          this.selectTableList = [item]
        }
        this.renderTotalList()
      }
    },
    renderTotalList(isFirst = false) {
      this.showList.map((item, Index) => {
        if (this.selectTotalList.indexOf(item[`${this.checkedName}`]) > -1) {
          this.$nextTick(() =>
            this.$refs.multipleTable.toggleRowSelection(item, true)
          )
        } else {
          this.$nextTick(() =>
            this.$refs.multipleTable.toggleRowSelection(item, false)
          )
        }
      })
    }
  }
};
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.view {
  color: $primaryColor;
  cursor: pointer;
}
.header-wrap {
  height: 38px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 26px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  .left-top {
    width: calc(100% - 220px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .search-item {
      font-size: 14px;
      width: 40%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 24px;
      &:last-child {
        margin-right: 0px;
      }
      span {
        width: 56px;
        text-align: left;
      }
      .all-input {
        width: calc(100% - 73px);
      }
    }
  }
  .right-top {
    align-items: center;
    display: flex;
    justify-content: flex-end;
  }
}
.dialog-footer {
  margin-top: 32px;
  text-align: right;
}
</style>
