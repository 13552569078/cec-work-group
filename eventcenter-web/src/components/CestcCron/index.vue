<template>
  <cestc-dialog
    v-bind="$attrs"
    title="corn表达式"
    width="682px"
    append-to-body
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <div class="card-container">
      <el-tabs>
        <el-tab-pane label="时">
          <el-radio-group v-model="result.hour.cronEvery" class="radio-group">
            <!-- <el-row>
              <el-radio label="1">每时</el-radio>
            </el-row>
            <el-row>
              <el-radio label="2">循环</el-radio>
              <span class="text">从</span>
              <el-input-number
                v-model="result.hour.incrementStart"
                :disabled="result.hour.cronEvery !== '2'"
                :min="0"
                :max="23"
              />
              <span class="text">小时开始,&nbsp;间隔</span>
              <el-input-number
                v-model="result.hour.incrementIncrement"
                :disabled="result.hour.cronEvery !== '2'"
                :min="0"
                :max="23"
              />
            </el-row> -->
            <el-row>
              <el-radio label="3">指定时(可多选)</el-radio>
              <el-select
                v-model="result.hour.specificSpecific"
                multiple
                class="one-line"
                :disabled="result.hour.cronEvery !== '3'"
              >
                <el-option
                  v-for="(val, index) in Array(24)"
                  :key="index"
                  :label="index"
                  :value="index"
                />
              </el-select>
            </el-row>
            <!-- <el-row>
              <el-radio label="4">区间</el-radio>
              <span class="text">从</span>
              <el-input-number
                v-model="result.hour.rangeStart"
                :disabled="result.hour.cronEvery !== '4'"
                :min="0"
                :max="23"
              />
              <span class="text"> 时&nbsp;至</span>
              <el-input-number
                v-model="result.hour.rangeEnd"
                :disabled="result.hour.cronEvery !== '4'"
                :min="0"
                :max="23"
              />
              <span class="text">时</span>
            </el-row> -->
          </el-radio-group>
        </el-tab-pane>
        <el-tab-pane label="日">
          <el-radio-group v-model="result.day.cronEvery" class="radio-group">
            <el-row>
              <el-radio label="1">每天</el-radio>
            </el-row>
            <!-- <el-row>
              <el-radio label="2">周循环</el-radio>
              <span class="text">从</span>
              <el-select
                v-model="result.week.incrementStart"
                :disabled="result.day.cronEvery !== '2'"
              >
                <el-option
                  v-for="(val, index) in Array(7)"
                  :key="index"
                  :value="index + 1"
                  :label="weekDays[index]"
                />
              </el-select>
              <span class="text">开始,&nbsp;间隔</span>
              <el-input-number
                v-model="result.week.incrementIncrement"
                :disabled="result.day.cronEvery !== '2'"
                :min="1"
                :max="7"
              />
              <span class="text">日</span>
            </el-row> -->
            <!-- <el-row>
              <el-radio label="3">日循环</el-radio>
              <span class="text">从</span>
              <el-input-number
                v-model="result.day.incrementStart"
                :disabled="result.day.cronEvery !== '3'"
                :min="1"
                :max="31"
              />
              <span class="text">日开始,&nbsp;间隔</span>

              <el-input-number
                v-model="result.day.incrementIncrement"
                :disabled="result.day.cronEvery !== '3'"
                :min="1"
                :max="31"
              />
              <span class="text">日</span>
            </el-row> -->
            <el-row>
              <el-radio label="4">指定星期(可多选)</el-radio>
              <el-select
                v-model="result.week.specificSpecific"
                :disabled="result.day.cronEvery !== '4'"
                multiple
                class="one-line"
              >
                <el-option
                  v-for="(val, index) in Array(7)"
                  :key="index"
                  :value="index + 1"
                  :label="weekDays[index]"
                />
              </el-select>
            </el-row>
            <el-row>
              <el-radio label="5">指定天(可多选)</el-radio>
              <el-select
                v-model="result.day.specificSpecific"
                :disabled="result.day.cronEvery !== '5'"
                multiple
                class="one-line"
              >
                <el-option
                  v-for="(val, index) in Array(31)"
                  :key="index"
                  :value="index + 1"
                  :label="index + 1"
                />
              </el-select>
            </el-row>
            <!-- <el-row>
              <el-radio label="6">在这个月的最后一天</el-radio>
            </el-row>
            <el-row>
              <el-radio label="7">在这个月的最后一个工作日</el-radio>
            </el-row> -->
            <!-- <el-row>
              <el-radio label="8">在这个月的最后一个</el-radio>
              <el-select
                v-model="result.day.cronLastSpecificDomDay"
                :disabled="result.day.cronEvery !== '8'"
                class="one-line"
              >
                <el-option
                  v-for="(val, index) in Array(7)"
                  :key="index"
                  :value="index + 1"
                  :label="weekDays[index]"
                />
              </el-select>
            </el-row> -->
            <!-- <el-row>
              <el-radio label="9">在本月底前</el-radio>
              <el-input-number
                v-model="result.day.cronDaysBeforeEomMinus"
                :disabled="result.day.cronEvery !== '9'"
                :min="1"
                :max="31"
              />
            </el-row> -->
            <!-- <el-row>
              <el-radio label="10">最近的工作日（周一至周五）至本月的</el-radio>
              <el-input-number
                v-model="result.day.cronDaysNearestWeekday"
                :disabled="result.day.cronEvery !== '10'"
                :min="1"
                :max="31"
              />
              <span class="text">日</span>
            </el-row> -->
          </el-radio-group>
        </el-tab-pane>
        <el-tab-pane label="月">
          <el-radio-group v-model="result.month.cronEvery" class="radio-group">
            <el-row>
              <el-radio label="1">每月</el-radio>
            </el-row>
            <!-- <el-row>
              <el-radio label="2">循环</el-radio>

              <span class="text">从</span>
              <el-input-number
                v-model="result.month.incrementStart"
                :disabled="result.month.cronEvery !== '2'"
                :min="1"
                :max="12"
              />
              <span class="text"> 月开始,&nbsp; 间隔</span>
              <el-input-number
                v-model="result.month.incrementIncrement"
                :disabled="result.month.cronEvery !== '2'"
                :min="1"
                :max="12"
              />
              <span class="text">月</span>
            </el-row> -->
            <el-row>
              <el-radio label="3">指定月(可多选)</el-radio>
              <el-select
                v-model="result.month.specificSpecific"
                :disabled="result.month.cronEvery !== '3'"
                multiple
                class="one-line"
              >
                <el-option
                  v-for="(val, index) in Array(12)"
                  :key="index"
                  :value="index + 1"
                  :label="index + 1"
                />
              </el-select>
            </el-row>
            <!-- <el-row>
              <el-radio label="4">区间</el-radio>
              <span class="text">从</span>
              <el-input-number
                v-model="result.month.rangeStart"
                :disabled="result.month.cronEvery !== '4'"
                :min="1"
                :max="12"
              />
              <span class="text">至</span>
              <el-input-number
                v-model="result.month.rangeEnd"
                :disabled="result.month.cronEvery !== '4'"
                :min="1"
                :max="12"
              />
              <span class="text">月</span>
            </el-row> -->
          </el-radio-group>
        </el-tab-pane>
        <!-- <el-tab-pane label="年">
          <el-radio-group v-model="result.year.cronEvery" class="radio-group">
            <el-row>
              <el-radio label="1">每年</el-radio>
            </el-row>
            <el-row>
              <el-radio label="2">循环</el-radio>
              <span class="text">从</span>

              <el-input-number
                v-model="result.year.incrementStart"
                :disabled="result.year.cronEvery !== '2'"
                :min="2019"
                :max="2119"
              />
              <span class="text"> 年开始, &nbsp;间隔</span>

              <el-input-number
                v-model="result.year.incrementIncrement"
                :disabled="result.year.cronEvery !== '2'"
                :min="1"
                :max="99"
              />
              <span class="text"> 年</span>
            </el-row>
            <el-row>
              <el-radio label="3">指定年(可多选)</el-radio>
              <el-select
                v-model="result.year.specificSpecific"
                :disabled="result.year.cronEvery !== '3'"
                multiple
                class="one-line"
              >
                <el-option
                  v-for="(val, index) in Array(100)"
                  :key="index"
                  :value="index + 2019"
                  :label="index + 2019"
                />
              </el-select>
            </el-row>
            <el-row>
              <el-radio label="4">区间</el-radio>
              <span class="text">从</span>
              <el-input-number
                v-model="result.year.rangeStart"
                :disabled="result.year.cronEvery !== '4'"
                :min="2019"
                :max="2119"
              />
              <span class="text">至</span>

              <el-input-number
                v-model="result.year.rangeEnd"
                :disabled="result.year.cronEvery !== '4'"
                :min="2019"
                :max="2119"
              />
              <span class="text">年</span>
            </el-row>
          </el-radio-group>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <div v-if="cronText" class="cron-text ellipsis2">{{ cronText }}</div>
  </cestc-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'CestcCron',
  props: {
    echoCron: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      weekDays: ['天', '一', '二', '三', '四', '五', '六'].map(
        (val) => '星期' + val
      ),
      result: {
        second: {},
        minute: {},
        hour: {},
        day: {},
        week: {},
        month: {},
        year: {}
      },
      defaultValue: {
        second: {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: 1,
          rangeEnd: 0,
          specificSpecific: []
        },
        minute: {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: 1,
          rangeEnd: '0',
          specificSpecific: []
        },
        hour: {
          cronEvery: '3',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: '0',
          rangeEnd: '23',
          specificSpecific: [0]
        },
        day: {
          cronEvery: '1',
          incrementStart: 1,
          incrementIncrement: '1',
          rangeStart: '1',
          rangeEnd: '30',
          specificSpecific: [],
          cronLastSpecificDomDay: 1,
          cronDaysBeforeEomMinus: 1,
          cronDaysNearestWeekday: 1
        },
        week: {
          cronEvery: '1',
          incrementStart: 1,
          incrementIncrement: 1,
          specificSpecific: [],
          cronNthDayDay: 1,
          cronNthDayNth: 1
        },
        month: {
          cronEvery: '1',
          incrementStart: 3,
          incrementIncrement: 1,
          rangeStart: 1,
          rangeEnd: 12,
          specificSpecific: []
        },
        year: {
          cronEvery: '1',
          incrementStart: 2019,
          incrementIncrement: 1,
          rangeStart: 2019,
          rangeEnd: 2119,
          specificSpecific: []
        },
        label: ''
      },
      cronText: ''
    }
  },
  computed: {
    secondsText() {
      let seconds = ''
      const cronEvery = this.result.second.cronEvery || ''
      switch (cronEvery.toString()) {
        case '1':
          seconds = '*'
          break
        case '2':
          seconds =
            this.result.second.incrementStart +
            '/' +
            this.result.second.incrementIncrement
          break
        case '3':
          this.result.second.specificSpecific.map((val) => {
            seconds += val + ','
          })
          seconds = seconds.slice(0, -1)
          break
        case '4':
          seconds =
            this.result.second.rangeStart + '-' + this.result.second.rangeEnd
          break
      }
      return seconds
    },
    minutesText() {
      let minutes = ''
      const cronEvery = this.result.minute.cronEvery || ''
      switch (cronEvery.toString()) {
        case '1':
          minutes = '*'
          break
        case '2':
          minutes =
            this.result.minute.incrementStart +
            '/' +
            this.result.minute.incrementIncrement
          break
        case '3':
          this.result.minute.specificSpecific.map((val) => {
            minutes += val + ','
          })
          minutes = minutes.slice(0, -1)
          break
        case '4':
          minutes =
            this.result.minute.rangeStart + '-' + this.result.minute.rangeEnd
          break
      }
      return minutes
    },
    hoursText() {
      let hours = ''
      const cronEvery = this.result.hour.cronEvery || '3'
      switch (cronEvery.toString()) {
        case '1':
          hours = '*'
          break
        case '2':
          hours =
            this.result.hour.incrementStart +
            '/' +
            this.result.hour.incrementIncrement
          break
        case '3':
          this.result.hour.specificSpecific.map((val) => {
            hours += val + ','
          })
          hours = hours.slice(0, -1)
          break
        case '4':
          hours = this.result.hour.rangeStart + '-' + this.result.hour.rangeEnd
          break
      }
      return hours
    },
    daysText() {
      let days = ''
      const cronEvery = this.result.day.cronEvery || '1'
      switch (cronEvery.toString()) {
        case '1':
          break
        case '2':
        case '4':
        case '11':
          days = '?'
          break
        case '3':
          days =
            this.result.day.incrementStart +
            '/' +
            this.result.day.incrementIncrement
          break
        case '5':
          this.result.day.specificSpecific.map((val) => {
            days += val + ','
          })
          days = days.slice(0, -1)
          break
        case '6':
          days = 'L'
          break
        case '7':
          days = 'LW'
          break
        case '8':
          days = this.result.day.cronLastSpecificDomDay + 'L'
          break
        case '9':
          days = 'L-' + this.result.day.cronDaysBeforeEomMinus
          break
        case '10':
          days = this.result.day.cronDaysNearestWeekday + 'W'
          break
      }
      return days
    },
    weeksText() {
      let weeks = ''
      const cronEvery = this.result.day.cronEvery || '1'
      switch (cronEvery.toString()) {
        case '1':
        case '3':
        case '5':
          weeks = '?'
          break
        case '2':
          weeks =
            this.result.week.incrementStart +
            '/' +
            this.result.week.incrementIncrement
          break
        case '4':
          this.result.week.specificSpecific.map((val) => {
            weeks += val + ','
          })
          weeks = weeks.slice(0, -1)
          break
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
          weeks = '?'
          break
        case '11':
          weeks =
            this.result.week.cronNthDayDay +
            '#' +
            this.result.week.cronNthDayNth
          break
      }
      return weeks
    },
    monthsText() {
      let months = ''
      const cronEvery = this.result.month.cronEvery || '1'
      switch (cronEvery.toString()) {
        case '1':
          months = '*'
          break
        case '2':
          months =
            this.result.month.incrementStart +
            '/' +
            this.result.month.incrementIncrement
          break
        case '3':
          this.result.month.specificSpecific.map((val) => {
            months += val + ','
          })
          months = months.slice(0, -1)
          break
        case '4':
          months =
            this.result.month.rangeStart + '-' + this.result.month.rangeEnd
          break
      }
      return months
    },
    yearsText() {
      let years = ''
      const cronEvery = this.result.year.cronEvery || '1'
      switch (cronEvery.toString()) {
        case '1':
          years = '*'
          break
        case '2':
          years =
            this.result.year.incrementStart +
            '/' +
            this.result.year.incrementIncrement
          break
        case '3':
          this.result.year.specificSpecific.map((val) => {
            years += val + ','
          })
          years = years.slice(0, -1)
          break
        case '4':
          years = this.result.year.rangeStart + '-' + this.result.year.rangeEnd
          break
      }
      return years
    },
    cron() {
      return `${this.secondsText || '0'} ${this.minutesText || '0'} ${
        this.hoursText || '*'
      } ${this.daysText || '*'} ${this.monthsText || '*'} ${
        this.weeksText || '?'
      } ${this.yearsText || '*'}`
    },
    visible() {
      return this.$attrs.visible
    }
  },
  watch: {
    '$attrs.visible': {
      handler(val) {
        let cron = this.echoCron
        // 逆向解析
        if (cron && val) {
          cron = JSON.parse(JSON.stringify(cron))
          this.secondsReverseExp(cron)
          this.minutesReverseExp(cron)
          this.hoursReverseExp(cron)
          this.daysReverseExp(cron)
          this.monthsReverseExp(cron)
          this.yearReverseExp(cron)
        } else {
          this.result = JSON.parse(JSON.stringify(this.defaultValue))
        }
      }
    },
    // 时、日、月表达式修改的时候，更新文案
    result: {
      deep: true,
      handler(val) {
        // 只有窗口打开的时候翻译
        if (this.visible) {
          this.translateToChinese()
        }
      }
    },
    cronText(val) {
      this.$emit('update:cronText', val)
    }
  },
  methods: {
    // cron 表达式转译中文
    translateToChinese(cron) {
      if (!cron) cron = this.cron
      moduleSrv.translateToChinese({ cron }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.cronText = res.data
        }
      })
    },
    secondsReverseExp(seconds) {
      const val = seconds.split(' ')[0] || []
      const second = {
        cronEvery: '',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 1,
        rangeEnd: 0,
        specificSpecific: []
      }
      switch (true) {
        case val.includes('*'):
          second.cronEvery = '1'
          break
        case val.includes('/'):
          second.cronEvery = '2'
          second.incrementStart = val.split('/')[0]
          second.incrementIncrement = val.split('/')[1]
          break
        case val.includes(','):
          second.cronEvery = '3'
          second.specificSpecific = val.split(',').map(Number).sort()
          break
        case val.includes('-'):
          second.cronEvery = '4'
          second.rangeStart = val.split('-')[0]
          second.rangeEnd = val.split('-')[1]
          break
        default:
          second.cronEvery = ''
      }
      this.result.second = second
    },
    minutesReverseExp(minutes) {
      const val = minutes.split(' ')[1] || []
      const minute = {
        cronEvery: '',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 1,
        rangeEnd: 0,
        specificSpecific: []
      }
      switch (true) {
        case val.includes('*'):
          minute.cronEvery = '1'
          break
        case val.includes('/'):
          minute.cronEvery = '2'
          minute.incrementStart = val.split('/')[0]
          minute.incrementIncrement = val.split('/')[1]
          break
        case val.includes(','):
          minute.cronEvery = '3'
          minute.specificSpecific = val.split(',').map(Number).sort()
          break
        case val.includes('-'):
          minute.cronEvery = '4'
          minute.rangeStart = val.split('-')[0]
          minute.rangeEnd = val.split('-')[1]
          break
        default:
          minute.cronEvery = ''
      }
      this.result.minute = minute
    },
    hoursReverseExp(hours) {
      const val = hours.split(' ')[2] || []
      const hour = {
        cronEvery: '',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 1,
        rangeEnd: '0',
        specificSpecific: []
      }
      switch (true) {
        case val.includes('*'):
          hour.cronEvery = '1'
          break
        case val.includes('/'):
          hour.cronEvery = '2'
          hour.incrementStart = val.split('/')[0]
          hour.incrementIncrement = val.split('/')[1]
          break
        case val.includes(','):
          hour.cronEvery = '3'
          hour.specificSpecific = val.split(',').map(Number).sort()
          break
        case val.includes('-'):
          hour.cronEvery = '4'
          hour.rangeStart = val.split('-')[0]
          hour.rangeEnd = val.split('-')[1]
          break
        default:
          hour.cronEvery = '3'
          hour.specificSpecific = val.split(',').map(Number).sort()
      }
      this.result.hour = hour
    },
    daysReverseExp(cron) {
      const days = cron.split(' ')[3] || []
      const weeks = cron.split(' ')[5] || []
      const day = {
        cronEvery: '',
        incrementStart: 1,
        incrementIncrement: 1,
        rangeStart: 1,
        rangeEnd: 1,
        specificSpecific: [],
        cronLastSpecificDomDay: 1,
        cronDaysBeforeEomMinus: 1,
        cronDaysNearestWeekday: 1
      }
      const week = {
        cronEvery: '1',
        incrementStart: 1,
        incrementIncrement: 1,
        specificSpecific: [],
        cronNthDayDay: 1,
        cronNthDayNth: '1'
      }
      if (!days.includes('?')) {
        // 天
        switch (true) {
          case days.includes('*'):
            day.cronEvery = '1'
            break
          case days.includes('?'):
            // 2、4、11
            break
          case days.includes('/'):
            day.cronEvery = '3'
            day.incrementStart = days.split('/')[0]
            day.incrementIncrement = days.split('/')[1]
            break
          case days.includes(','):
            day.cronEvery = '5'
            day.specificSpecific = days.split(',').map(Number).sort()
            break
          case days.includes('LW'):
            day.cronEvery = '7'
            break
          case days.includes('L-'):
            day.cronEvery = '9'
            day.cronDaysBeforeEomMinus = days.split('L-')[1]
            break
          case days.includes('L'):
            if (days.len === 1 || days.len === '1') {
              day.cronEvery = '6'
              day.cronLastSpecificDomDay = '1'
            } else {
              day.cronEvery = '8'
              day.cronLastSpecificDomDay = Number(days.split('L')[0])
            }
            break
          case days.includes('W'):
            day.cronEvery = '10'
            day.cronDaysNearestWeekday = days.split('W')[0]
            break
          default:
            day.cronEvery = '1'
        }
      } else {
        switch (true) {
          case weeks.includes('/'):
            day.cronEvery = '2'
            week.incrementStart = weeks.split('/')[0]
            week.incrementIncrement = weeks.split('/')[1]
            break
          case weeks.includes(','):
            day.cronEvery = '4'
            week.specificSpecific = weeks.split(',').map(Number).sort()
            break
          case '#':
            day.cronEvery = '11'
            week.cronNthDayDay = weeks.split('#')[0]
            week.cronNthDayNth = weeks.split('#')[1]
            break
          default:
            day.cronEvery = '4'
            week.specificSpecific = weeks.split(',').map(Number).sort()
            week.cronEvery = '1'
        }
      }
      this.result.day = day
      this.result.week = week
    },
    monthsReverseExp(cron) {
      const months = cron.split(' ')[4] || []
      const month = {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 1,
        rangeEnd: 12,
        specificSpecific: []
      }
      switch (true) {
        case months.includes('*'):
          month.cronEvery = '1'
          break
        case months.includes('/'):
          month.cronEvery = '2'
          month.incrementStart = months.split('/')[0]
          month.incrementIncrement = months.split('/')[1]
          break
        case months.includes(','):
          month.cronEvery = '3'
          month.specificSpecific = months.split(',').map(Number).sort()
          break
        case months.includes('-'):
          month.cronEvery = '4'
          month.rangeStart = months.split('-')[0]
          month.rangeEnd = months.split('-')[1]
          break
        default:
          month.cronEvery = '1'
      }
      this.result.month = month
    },
    yearReverseExp(cron) {
      const years = cron.split(' ')[6] || []
      const year = {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 2019,
        rangeEnd: 2019,
        specificSpecific: []
      }
      switch (true) {
        case years.includes('*'):
          year.cronEvery = '1'
          break
        case years.includes('/'):
          year.cronEvery = '2'
          year.incrementStart = years.split('/')[0]
          year.incrementIncrement = years.split('/')[1]
          break
        case years.includes(','):
          year.cronEvery = '3'
          year.specificSpecific = years.split(',').map(Number).sort()
          break
        case years.includes('-'):
          year.cronEvery = '4'
          year.rangeStart = years.split('-')[0]
          year.rangeEnd = years.split('-')[1]
          break
        default:
          year.cronEvery = '1'
      }
      this.result.year = year
    },
    // 确定
    _confirm() {
      this.$emit('confirm', this.cron)
      this._cancle()
    },
    // 取消关闭弹窗
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.radio-group {
  width: 100%;
  .el-row {
    min-height: 46px;
    display: flex;
    align-items: center;
    .one-line {
      width: 100%;
    }
    .text {
      font-size: 14px;
      color: rgba(0, 16, 47, 0.65);
      padding: 0 10px;
    }
  }
}
.cron-text {
  text-align: center;
  padding: 10px;
}
</style>
