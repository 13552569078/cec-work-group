<template>
  <div class="log-list-box">
    <c-collapse v-model="interfaceActiveName" accordion class="interface-collapse">
      <c-collapse-item v-for="item,i in showList" :key="i" :name="i+''">
        <template slot="title">
          <div class="collapse-title-box">
            <div class="line"></div>
            <div class="path">
              <p class="version">{{ item.version||"开发版本" }}</p>
            </div>

          </div>
        </template>
        <div class="collapse-content" v-html="item.log">
        </div>
      </c-collapse-item>

    </c-collapse>
  </div>
</template>

<script>
import { groupReleaseLog } from '@/api'
export default {
  props: {
    selectdata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      interfaceActiveName: '0',
      showList: []
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
    getLogList() {
      console.log(this.selectdata, 'this.selectdata')
      groupReleaseLog(this.selectdata.appCode).then(res => {
        this.showList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.log-list-box{
  background: #F6F9FB;
  .interface-collapse {
  &::v-deep {
    .c-icon-caret-bottom:before {
      content: '\e6df';
    }
    .c-collapse-item__header {
      height: 40px;
      &:first-child {
        border-top: 1px solid #ededed;
      }
    }
    .c-collapse-item__content {
      padding-bottom: 0px;
    }
    .is-active {
      .c-icon-caret-bottom {
        color: #36a4ff !important ;
      }
      .line {
        background: #36a4ff !important;
      }
    }
    .c-collapse-item__arrow {
      margin-right: 24px;
    }
  }
  .collapse-title-box {
    display: flex;
    justify-content: space-between;
    .line {
      width: 4px;
      height: 40px;
      background: rgba(30, 111, 255, 0.2);
    }

    .path {
      width: 308px;
      display: flex;
      align-items: center;
      margin-left: 16px;
      .version {
        display: flex;
        align-items: center;
        font-weight: 400;
        color: #8a8a8a;
        line-height: 20px;
        margin-right: 24px;
        &::before {
          content: '';
          display: block;
          width: 14px;
          height: 12px;
          background: url(~@/assets/imgs/version.svg) no-repeat;
          background-size: 100%;
          margin-right: 8px;
        }
      }
      .name {
        width: 192px;
        font-weight: 500;
        color: #4b4b4b;
        line-height: 20px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap;
      }
    }
    .method {
      display: flex;
      align-items: center;

      .btn {
        color: #8a8a8a;
        font-weight: normal;

        margin-left: 56px;
      }
      .btn:hover {
        color: #36a4ff;
      }
    }
  }
  .collapse-content{
    background: #F3F4FB;
    padding: 16px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .api-card{
      margin-bottom: 20px;
      width:309px;
      height: 170px;
      margin-right: 18px;
      background: #fff;
      box-shadow: 4px 6px 20px 0px #E8EDF5;
      border: 2px solid #FFFFFF;
      position: relative;
      padding: 24px 0 0 32px;
      cursor: pointer;
      &:nth-child(5n){

      margin-right: 0px;
      }
      .title{
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        width: 240px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span{
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
          display: inline-block;
          width: 176px;
          margin-right: 16px;
          margin-bottom:8px;
        }
      }
      .version{
        display: flex;
        align-items: center;
        font-weight: 400;
        color: #8A8A8A;
        line-height: 20px;
        margin-right: 24px;
        font-size: 14px;
        &::before{
          content: '';
          display: block;
          width: 14px;
          height: 12px;
          background: url(~@/assets/imgs/version.svg) no-repeat;
          background-size: 100%;
        margin-right: 8px;
        }
      }
    }
  }
}
.ac-icon-bottom {
    display: flex;
    align-items: center;
    min-width: 72px;
    height: 32px;
    background: linear-gradient(180deg, #f3f5f8 0%, #fdfdfe 100%);
    box-shadow: 2px 3px 8px 0px rgba(232, 237, 245, 0.6);
    border-radius: 16px 0px 0px 16px;
    border: 1px solid #ffffff;
    position: absolute;
    bottom: 8px;
    right: 0px;
    z-index: 1001;
    text-align: right;
    padding-right: 24px;
    padding-left: 16px;

    .icon-operat {
      min-width: 48px;
      height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8a8a8a;
      line-height: 26px;
      cursor: pointer;
      margin-right: 12px;
      line-height: 32px;
      display: flex;
      align-items: center;

      &:last-child {
        margin: 0 0px;
      }

      &:hover {
        color: #36a4ff;
      }

      &::v-deep {
        .c-checkbox {
          color: #8a8a8a;

          &:hover {
            color: #36a4ff;

            .c-checkbox__inner {
              border-color: #36A4FF;
            }
          }
        }

        .is-checked {
          .c-checkbox__label {
            color: #36a4ff;
          }
        }

        // .is-focus{
        //   .c-checkbox__inner{
        //     border: 1px solid #E7E7E7;
        //   }
        // }
      }
    }

  }
}

</style>
