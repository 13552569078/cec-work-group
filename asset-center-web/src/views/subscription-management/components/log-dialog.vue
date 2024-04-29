<template>
  <c-dialog title="升级日志" :visible.sync="dialogFlag" width="666px" :before-close="handleClose"
            class="timeline">
    <c-timeline>
      <c-timeline-item v-for="(item,index) in showList" :key="item.packTime"
                       hide-timestamp
      >
        <div v-if="index==0" slot="dot" class="dot-ring first-dot">
        </div>
        <div v-else slot="dot" class="dot-ring">
        </div>
        <div class="card-wrap">
          <div ref="header" class="card-header" @click="cardClick(item,index)">
            <div class="left-box">
              <div class="version">{{ item.packVersion }}</div>
              <div class="time">{{ item.packTime }}</div>
            </div>
            <div class="right-box" :class="active==index?'active':''">
              <div class="btn">被引用详情</div>
              <div class="back"></div>
            </div>
          </div>
          <div v-if="active==index" class="card-content">
            <div class="title">被引用关系</div>
            <c-table
              ref="multipleTable"
              class="hidden-checkall-header"
              :data="item.list||[]"
              max-height="200px"
              element-loading-text="Loading"
            >

              <c-table-column label="资源名称" prop="name" show-overflow-tooltip min-width="150">
              </c-table-column>
              <c-table-column label="版本号" prop="version" show-overflow-tooltip min-width="90">
              </c-table-column>
              <c-table-column label="类型" prop="type" show-overflow-tooltip min-width="120">
              </c-table-column>
              <c-table-column
                label="操作"
                fixed="right"
                width="80"
              >
                <template slot-scope="scope">

                  <span
                    class=" icon-operate"
                    @click="goDetail(scope.row)"
                  >查看</span>
                </template>
              </c-table-column>
            </c-table>
          </div>
        </div>
      </c-timeline-item>
    </c-timeline>
  </c-dialog>

</template>
<script>
import { DefaultValue } from '@/config/index'
import { assetMysubReferenced } from '@/api'
import { goDetail, getAssetTypeLabel } from '@/utils'
export default {
  name: 'AuthInfo',

  props: {
    data: {
      type: Object,
      default: () => {
        return {
          shopCode: '',
          packVersion: '',
          appName: ''
        }
      }
    },
    isInterfaceAPI: {
      type: Boolean,
      default: false
    },
    dialogFlag: {
      type: Boolean,
      default: false
    },
    logList: { // 日志数据
      type: Array,
      default: () => {
        return []
      }
    },
    flag: {
      type: [String],
      default: ''
    },
    groupId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      defaultValue: DefaultValue,
      showList: this.logList.map(item => {
        return { ...item, list: [] }
      }),
      active: -1
    };
  },
  computed: {

  },
  created() {
  },
  mounted() {
    // setTimeout(() => {
    //   if (this.$refs.header) {
    //     this.$nextTick(() => {
    //       this.$refs.header[0].click()
    //     })
    //   } else {
    //     setTimeout(() => {
    //       this.$nextTick(() => {
    //         this.$refs.header && this.$refs.header[0].click()
    //       })
    //     }, 600)
    //   }
    // }, 600)
  },
  destroyed() {

  },
  methods: {
    cardClick(item, index) {
      if (this.active === index) {
        this.active = -1
        return
      }
      this.active = index;
      this.getAssetMysubReferenced(item.bizCode, index)
    },
    goDetail(row) {
      row = { ...row, assetId: row.id }
      goDetail(row)
    },
    getAssetMysubReferenced(bizCode, index) {
      assetMysubReferenced({
        bizCode: bizCode,
        shopCode: this.isInterfaceAPI ? this.data.shopCode : '',
        packVersion: this.isInterfaceAPI ? this.data.packVersion : '',
        pageSize: 100
      }).then(res => {
        this.showList[index].list = res.data.list.map(item => {
          return {
            ...item,
            type: getAssetTypeLabel(item.assetType, item.subtype)
          }
        })
      })
    },
    handleClose() {
      this.$emit('close')
    },
    openDetail(item) {
      this.$emit('downloadOpen', item)
    }

  }
};
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.card-header{
  /* 矩形备份 11 */

  height: 48px;
  border-radius: 2px;
  opacity: 1;
  background: #F9FAFE;
  display: flex;
  align-items: center;
    border-bottom: 1px solid  #EDEDED;;
  padding: 0 16px;
  justify-content: space-between;
  .left-box{
    display: flex;
  align-items: center;
  }
  .right-box{
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .version{
    display: flex;
    align-items: center;
    font-weight: 400;
    color: #8A8A8A;
    line-height: 20px;
    margin-right: 24px;
    &::before{
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      background: url(~@/assets/imgs/version.svg) no-repeat;
      background-size: 100%;
    margin-right: 8px;
    }
  }

  .time{
    color: #8A8A8A;
  }
  .btn{
    color: #4B4B4B;
  }
  .back{
    width: 10px;
    height: 6px;
    background: url(~@/assets/imgs/back.svg) no-repeat;
    background-size:100% ;
    margin-left: 19px;
  }
  .active{
    .back{
    width: 10px;
    height: 6px;
    background: url(~@/assets/imgs/back-active.svg) no-repeat;
    background-size:100% ;
    margin-left: 19px;
  }
  .btn{
    color: #36A4FF;
  }
  }
}
.card-content{
  padding: 16px 0px;
  .title{
    color: #8A8A8A;
    margin-bottom:8px ;
    margin-left: 16px;
  }
  .content{
    color: #4B4B4B;
    line-height: 1.2;
  }
}
.timeline {
  &::v-deep{
    .c-timeline-item__timestamp.is-bottom{
      margin-top: 0px;
    }
  }
  .dot-ring {
    width: 14px;
    height: 14px;
    border-radius: 100%;
    position: relative;
    border: 3px solid #8a8a8a;
    background: #fff;
    margin-left: -2px;
    &.first-dot {
      border: 3px solid #36A4FF;
    }

    // .start-line{

    // }

    .start-dot {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #fff;
      border: 2px solid #ededed;
      left: -1px;
      top: -35px;

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 22px;
        top: 8px;
        border-left: 2px solid #ededed;
        left: 2px;
      }
    }
  }
  .card-wrap {
    background: #f9fafe;
    border-radius: 2px;
  }
}
.icon-operate{
  cursor: pointer;
  color: #36A4FF;
}
</style>
