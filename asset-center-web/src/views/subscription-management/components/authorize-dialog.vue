<template>
  <c-dialog :class="'dialog-center'" :title="'查看授权'" width="460px" :visible.sync="dialogFlag"
            append-to-body :before-close="close">
    <c-collapse v-model="interfaceActiveName" accordion class="interface-collapse">
      <c-collapse-item v-for="formData,i in list" :key="i" :name="i+''">
        <template slot="title">
          <div class="collapse-title-box">
            <div class="line"></div>
            <div class="path">
              <p class="name">{{ formData.appName }}</p>
            </div>

          </div>
        </template>
        <div class="collapse-content">
          <div>
            <div class="desc">{{ formData.appDesc }}</div>
            <div class="box">
              <div class="label">ClientId <i v-copy="formData.clientId" class="copy"
                                             style="    right: 235px;" @click="clickCopy('ClientId')" /></div>
              <div class="value">{{ formData.clientId }}</div>
            </div>
            <div class="box">
              <div class="label">ClientSecret <i v-copy="formData.clientSecret" class="copy"
                                                 style="    right: 235px;" @click="clickCopy('ClientSecret')" /></div>
              <div class="value">{{ formData.clientSecret }}</div>
            </div>
          </div>

        </div>
      </c-collapse-item>

    </c-collapse>

    <div slot="footer" class="dialog-footer">
      <c-button type="gradual" size="small" @click="close">确定</c-button>
    </div>
  </c-dialog>

</template>
<script>
import { DefaultValue } from '@/config/index'
import { appsAuthorizeInfo } from '@/api'
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
    dialogFlag: {
      type: Boolean,
      default: false
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
      interfaceActiveName: '0',
      pageTopBtns: [
        {
          type: 'primary',
          disabled: false,
          label: '保存'
        }
      ],
      list: [],
      span: 24,
      options: [
      ],

      attributeTypedata: '请输入正整数',
      topicTreeData: [],
      processLog: ''
    };
  },
  computed: {
    isView() {
      if (this.flag === 'view') {
        return true;
      }
      return false;
    },
    isEidt() {
      if (this.flag === 'edit') {
        return true;
      }
      return false;
    }
  },
  created() {
    this.getAuthDetail()
  },
  mounted() {

  },
  methods: {
    clickCopy(flag) {
      this.$message.success(flag + '已复制')
    },
    close() {
      this.$emit('close')
    },
    getAuthDetail() {
      appsAuthorizeInfo({ packVersionId: this.data.packVersionId }).then(res => {
        this.list = res.data
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.cls-model-form {
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog-footer {
  text-align: right;
}
.half-form-item {
  width: 50.85%;
  display: inline-block;
}
.header {
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  .border {
    width: 4px;
    height: 14px;
    background: $primaryColor;
    margin: 0 8px 0 0px;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    color: $textColor;
  }
}
.no-margin {
  margin: 0;
}
.copy {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(~@/assets/logo/copy.png) no-repeat center;
  background-size: 100%;
  z-index: 2;
  cursor: pointer;
  &:hover {
    background-image: url(~@/assets/logo/copy-hover.png);
  }
}
.desc {
  /* 文本样式/md */
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0em;

  /* 文本色/text-secondary */
  color: #8a8a8a;
  margin-bottom: 16px;
}
.box {
  .label {
    position: relative;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    letter-spacing: 0em;

    /* 文本色/text-secondary */
    color: #8a8a8a;
    margin-bottom: 6px;
    margin-top: 6px;
    margin-right: 8px;
  }
  .value {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;

    /* 文本色/text-regular */
    color: #4b4b4b;
  }
}
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
      width: 300px;
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
          width: 16px;
          height: 16px;
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
  .collapse-content {
    background: #f3f4fb;
    padding: 24px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .api-card {
      margin-bottom: 20px;
      width: 309px;
      height: 170px;
      margin-right: 18px;
      background: #fff;
      box-shadow: 4px 6px 20px 0px #e8edf5;
      border: 2px solid #ffffff;
      position: relative;
      padding: 24px 0 0 32px;
      cursor: pointer;
      &:nth-child(5n) {
        margin-right: 0px;
      }
      .title {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        width: 240px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          width: 176px;
          margin-right: 16px;
          margin-bottom: 8px;
        }
      }
      .version {
        display: flex;
        align-items: center;
        font-weight: 400;
        color: #8a8a8a;
        line-height: 20px;
        margin-right: 24px;
        font-size: 14px;
        &::before {
          content: '';
          display: block;
          width: 16px;
          height: 16px;
          background: url(~@/assets/imgs/version.svg) no-repeat;
          background-size: 100%;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
