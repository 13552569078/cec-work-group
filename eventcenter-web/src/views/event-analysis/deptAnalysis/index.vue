<template>
  <div class="Analysissis-wrap">
    <div class="serach">
      <el-form :inline="true" style="width: 100%">
        <el-form-item label="上报时间:">
          <el-date-picker
            v-model="seratcTime"
            type="daterange"
            placeholder="选择上报时间"
            class="form-item-width"
            value-format="yyyy-MM-dd"
            @change="changeTime(seratcTime)"
          />
        </el-form-item>
        <el-form-item label="实体部门:" class="m-l-20">
          <el-select v-model="deptCode" placeholder="选择实体部门" class="form-item-width">
            <el-option v-for="item in depList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="" class="m-l-20">
          <div class="search-department-wrap">
            <span class="label">职能部门：</span>
            <span class="text">{{ deptCodeTag }}</span>
          </div>
        </el-form-item>
      </el-form>
      <div class="btn-wrap">
        <el-button class="cestc-button" @click="reset">重置</el-button>
        <el-button type="primary" class="cestc-button" @click="init">查询</el-button>
      </div>
    </div>
    <div class="result-content">
      <div class="card-wrap">
        <this-dep ref="thisDepRef" :serach-params="serachParams" />
      </div>
      <div class="card-wrap m-t-20">
        <next-dep ref="nextDepRef" :serach-params="serachParams" />
      </div>
      <div class="card-wrap-bottom m-t-20">
        <div class="card-wrap card-wrap2">
          <event-type ref="eventTypeRef" :serach-params="serachParams" />
        </div>
        <div class="card-wrap card-wrap2">
          <accepting-officer ref="acceptingOfficerRef" :serach-params="serachParams" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import dayjs from 'dayjs'
import eventAnalysisApi from '@/api/eventAnalysis'
import searchMixin from '@/mixin/searchMixin'
import { ThisDep, NextDep, EventType, AcceptingOfficer } from './components/index'

const formatType = 'YYYY-MM-DD'

export default {
  name: 'EventcenterWebEventTypeAnalysissisNew',
  components: {
    ThisDep,
    NextDep,
    EventType,
    AcceptingOfficer
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      deptCode: '',
      seratcTime: [dayjs().subtract(30, 'day').format(formatType), dayjs().format(formatType)],
      depList: []
    }
  },
  computed: {
    serachParams() {
      return {
        fresh: this.fresh,
        deptCode: this.deptCode,
        beginDate: this.seratcTime[0] ? this.seratcTime[0] + ' 00:00:00' : '',
        endDate: this.seratcTime[1] ? this.seratcTime[1] + ' 23:59:59' : ''
      }
    },
    deptCodeTag() {
      const data = this.depList.filter((item) => {
        return item.id === this.deptCode
      })
      return data[0] ? data[0]?.dutyDeptCodeName ? data[0]?.dutyDeptCodeName : '--' : '--'
    }
  },
  async mounted() {
    await this.getDeptList()
    this.init()
  },

  methods: {
    async reset() {
      Object.assign(this.$data, this.$options.data())
      await this.getDeptList()
      this.init()
    },
    async init() {
      await this.$nextTick()
      this.$refs.thisDepRef.init()
      this.$refs.nextDepRef.init()
      this.$refs.eventTypeRef.init()
      this.$refs.acceptingOfficerRef.init()
    },
    async getDeptList() {
      const { data } = await eventAnalysisApi.getOrgListByToken()
      this.depList = data
      this.deptCode = data.length > 0 ? data[0].id : ''
    },
    initSearchTime() {
      this.seratcTime = [dayjs().subtract(30, 'day').format(formatType), dayjs().format(formatType)]
    },
    changeTime() {
      if (Array.isArray(this.seratcTime)) {
        const startDate = dayjs(this.seratcTime[0])
        const endDate = dayjs(this.seratcTime[1])
        const diffInDays = endDate.diff(startDate, 'day')
        if (diffInDays > 365) {
          this.$message({
            message: '跨度最大365天!',
            type: 'warning'
          })
          this.initSearchTime()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Analysissis-wrap {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;

  .serach {
    background-color: #fff;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px 0px;
    border-top: 1px solid #36A4FF;

    .search-department-wrap {
      margin-top: 6px;

      .label {
        color: #8A8A8A;
      }
    }

    .btn-wrap {
      display: flex;
      margin-top: -20px;
    }
  }

  .card-wrap {
    padding: 20px;
    background-color: #fff;
    &.card-wrap2{
      padding: 20px 20px 0px;
      padding-bottom: 0px;
    }
    .title {
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #4B4B4B;
      border-left: 4px solid #36A4FF;
      padding-left: 10px;
    }
  }

  .card-wrap-bottom {
    display: flex;
    gap: 20px;

    div {
      flex: 1;
    }
  }
}

.form-item-width {
  width: 300px;
}

.m-l-20 {
  margin-left: 0px;
}
.m-t-20 {
  margin-top: 20px;
}

::v-deep {
  .el-form-item__label {
    margin-top: 6px
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #EDEDED;
  }

  .el-table--border,
  .el-table--group {
    border-bottom: 1px solid #EDEDED;
  }
}
</style>
