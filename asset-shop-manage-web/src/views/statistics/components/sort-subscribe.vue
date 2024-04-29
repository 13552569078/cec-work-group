<!--/*
* @Author: dingli
* @Desc: 订阅量排名
* @Date:
*/-->
<template>
  <div class="sort-subscribe-wrap">
    <h3 class="info-title">订阅量排名</h3>
    <span class="btn-radio">
      <span class="btn-radio-item" :class="{active:timeFlag==6}" @click="clickTab(6)">近7天</span>
      <span class="btn-radio-item" :class="{active:timeFlag==29}" @click="clickTab(29)">总榜</span>
    </span>
    <c-table v-show="(list&&list.length)" :data="list" :border="true" class="list-wrap">
      <c-table-column type="index" label="#" width="50">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </c-table-column>
      <c-table-column label="资源名称" prop="packName" show-overflow-tooltip></c-table-column>
      <c-table-column label="资源分类" prop="assetType" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ _asseTypeFormat(scope.row.assetType, scope.row.assetSubtype) }}
        </template>
      </c-table-column>
      <c-table-column label="订阅次数" prop="downloadCount" show-overflow-tooltip></c-table-column>
    </c-table>
    <empty v-if="!(list&&list.length)" text="暂无数据" type="no-data" style="height:400px;width:280px;margin:0 auto;" />
  </div>
</template>
<script>
import moment from 'moment-cn'
import empty from '@l/components/empty'
import { queryTopAnalysis } from '@/api/statistics'
import { asseTypeFormat } from '@/utils/enumerate'
export default {
  name: 'SortSubscribe',
  components: { empty },
  props: {},
  data() {
    return {
      timeFlag: 6,
      list: []
    }
  },
  computed: {},
  created() {
    this.getData()
  },
  methods: {
    _asseTypeFormat(type, subType) {
      return asseTypeFormat(type, subType) || '--'
    },
    clickTab(v) {
      this.timeFlag = v
      this.getData()
    },
    async getData() {
      try {
        const params = {
          type: 3
        }
        if (+this.timeFlag === 6) {
          params.startTime = moment().subtract('days', 6).format('YYYY-MM-DD') + ' 00:00:00'
          params.endTime = moment().format('YYYY-MM-DD') + ' 23:59:59'
        }
        let resdata = await queryTopAnalysis(params)
        resdata = resdata.data
        this.list = resdata
      } catch (e) {
        // e
      }
    }
  }
}
</script>
<style scoped lang="scss">
.sort-subscribe-wrap {
  position: relative;
  width: 100%;
  min-width: 616px;
  height: 610px;
  background: #FFFFFF;
  font-size: 14px;
}
.info-title {
  padding-top: 20px;
  margin-bottom: 0px;
  margin-left: 20px;
}
.btn-radio {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
}
.list-wrap {
  width: calc(100% - 80px);
  margin-top: 30px;
  margin-left: 40px;
}
::v-deep.list-wrap.c-table {
  border-bottom: 0 !important;
  border-right: 0 !important;
  .c-table__header-wrapper {
    border-bottom: 1px solid #E4E9ED;
  }
  th {
    color: #202020;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    font-weight: 500;
  }
  th:first-child, td:first-child {
    color: #8A8A8A;
  }
  td, th {
    padding: 12px 0;
    border-right: 1px solid #E4E9ED;
  }
}
</style>
