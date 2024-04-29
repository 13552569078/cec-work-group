<!--
 * @description 全局统一时间区间选择插件
 * @date 2020-08-20
 * @author lism
-->
<template>
  <div class="cestc-date-picker">
    <el-date-picker
      v-bind="$attrs"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :type="type"
      unlink-panels
      :clearable="false"
      :value-format="valueFormat"
      :default-time="defaultTime"
      popper-class="cestc-date-picker-popper"
      :picker-options="type === 'daterange' ? pickerOptions : customPickerOptions"
      v-on="$listeners"
    />
  </div>
</template>

<script>
export default {
  name: 'CestcDatePicker',
  props: {
    nowFlag: { // 是否当前时刻
      type: [Boolean],
      default: false
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    type: {
      type: String,
      default: 'date'
    },
    customPickerOptions: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近7天',
            onClick(picker) {
              const _date = new Date()
              const end = new Date(_date.setHours(23, 59, 59, 59))
              const start = new Date(_date.setHours(0, 0, 0, 0))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              const _date = new Date()
              const end = new Date(_date.setHours(23, 59, 59, 59))
              const start = new Date(_date.setHours(0, 0, 0, 0))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近90天',
            onClick(picker) {
              const _date = new Date()
              const end = new Date(_date.setHours(23, 59, 59, 59))
              const start = new Date(_date.setHours(0, 0, 0, 0))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    defaultTime() {
      let time
      // 时间区间默认
      if (this.type === 'daterange') {
        time = ['00:00:00', '23:59:59']
      } else if (this.type === 'datetime') {
        time = '23:59:59'
      }
      if (this.nowFlag) {
        // 当传有默认值的时候使用默认值
        const date = new Date()
        time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      }
      return time
    }
  }
}
</script>

<style lang="scss">
// 把之前的图标干掉，添加自己的图标
</style>
