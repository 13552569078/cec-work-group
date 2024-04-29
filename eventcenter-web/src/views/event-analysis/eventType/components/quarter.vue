<template>
  <div>
    <mark v-show="showSeason" class="_mark" @click.stop="showSeason = false" />
    <el-input v-model="showValue" placeholder="请选择季度" size="small" style="width: 100%;" suffix-icon="ccxd-icon-calendar" @focus="showSeason = true" />
    <el-card v-show="showSeason" class="box-card">
      <div slot="header" class="clearfix yearBtn">
        <button
          type="button"
          aria-label="前一年"
          class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
          @click="prev"
        />
        <span role="button" class="el-date-picker__header-label">{{ year }}年</span>
        <button
          type="button"
          aria-label="后一年"
          class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
          @click="next"
        />
      </div>
      <div class="text item">
        <el-button type="text" size="medium" class="_left" @click="selectSeason(0)">第一季度
        </el-button>
        <el-button type="text" size="medium" class="_right" @click="selectSeason(1)">第二季度
        </el-button>
      </div>
      <div class="text item">
        <el-button type="text" size="medium" class="_left" @click="selectSeason(2)">第三季度
        </el-button>
        <el-button type="text" size="medium" class="_right" @click="selectSeason(3)">第四季度
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs'
const formatType = 'YYYY-MM-DD'

export default {
  props: {
    valueArr: {
      default: () => {
        return ['01-03', '04-06', '07-09', '10-12']
      },
      type: Array
    },
    getValue: {
      default: () => {
      },
      type: Function
    },
    defaultValue: {
      default: '',
      type: String
    }
  },

  data() {
    return {
      showSeason: false,
      season: '',
      year: new Date().getFullYear(),
      showValue: ''
    }
  },
  watch: {
    defaultValue: (value) => {
      const arr = value.split('-')
      this.year = arr[0].slice(0, 4)
      const str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
      const arrAll = this.valueArr
      this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
    }
  },

  created() {
    if (this.defaultValue) {
      this.showValue = this.defaultValue
    }
  },
  methods: {
    prev() {
      this.year = this.year * 1 - 1
    },
    next() {
      this.year = this.year * 1 + 1
    },
    selectSeason(i) {
      const that = this
      that.season = i + 1
      const arr = that.valueArr[i].split('-')
      that.getValue(that.year + arr[0] + '-' + that.year + arr[1])
      that.showSeason = false
      if (this.season === 1) {
        this.showValue = `${this.year}年第一季度`
      } else if (this.season === 2) {
        this.showValue = `${this.year}年第二季度`
      } else if (this.season === 3) {
        this.showValue = `${this.year}年第三季度`
      } else if (this.season === 4) {
        this.showValue = `${this.year}年第四季度`
      }
      const data = this.getQuarterDays(this.year, i)
      that.sendMsg(data)
    },
    getQuarterDays(year, quarter) {
      if (quarter === 0) {
        return [new Date(`${year}-01-01`), new Date(`${year}-03-31`)]
      } else if (quarter === 1) {
        return [new Date(`${year}-04-01`), new Date(`${year}-06-30`)]
      } else if (quarter === 2) {
        return [new Date(`${year}-07-01`), new Date(`${year}-09-30`)]
      } else if (quarter === 3) {
        return [new Date(`${year}-10-01`), new Date(`${year}-12-31`)]
      } else {
        throw Error('Invalid quarter')
      }
    },
    sendMsg(data) {
      this.$emit('func', { startTime: dayjs(data[0]).format(formatType), endTime: dayjs(data[1]).format(formatType) })
    }
  }

}

</script>

<style scoped>
._mark {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 999;
}

.yearBtn {
  text-align: center;
  padding: 0;
}

.box-card {
  width: 322px;
  padding: 0 3px 20px;
  margin-top: 10px;
  position: fixed;
  z-index: 9999;
}

.text.item {
  text-align: center;
}

.text.item>>>.el-button {
  width: 40%;
  color: #606266;
}

.text.item ._left {
  float: left;
}

.text.item ._right {
  float: right;
}
</style>
