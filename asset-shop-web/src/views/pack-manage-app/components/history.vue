<!--/*
* @Author: dingli
* @Desc: 上下架管理-历史版本
* @Date: 2022-1-27
*/-->
<template>
  <div class="cls-history">
    <div class="bg-white">
      <topInfo
        :ishistory="true"
        pack-name=""
        version="版本历史记录"
        time="显示资源下所有的生效历史信息，可以打开指定条目来查看对应的资源详情及审核信息"
        :btn-list="[]"
      />
      <empty v-show="!list.length" text="暂无历史版本" />
      <c-collapse v-show="list.length" v-model="collapseActive" accordion class="cls-collapse" @change="collapseChange">
        <c-collapse-item v-for="(item,i) in list" :key="item.packVersion" :name="i">
          <template slot="title">
            <div class="flex">
              <span class="title">{{ `${item.packStatus==13?'注册信息':item.packVersion}` }}</span>
              <span class="openText">{{ collapseActive===i?'收起详情':'展开全部' }}</span>
            </div>
          </template>
          <div class="detail">
            <div v-show="item.packStatus!=13" class="row-item">
              <label class="label">版本说明</label>
              <span class="value">{{ detail.packVersionDesc || '--' }}</span>
            </div>
            <div class="row-item">
              <label class="label">{{ item.packStatus==13?'注册详情':'版本详情' }}</label>
              <span class="show-snapshoot" @click="showSnapshoot(item)">查看应用快照</span>
            </div>
            <div v-show="item.packStatus==5" class="row-item right">
              <c-button type="primary" @click="clickPackAgain(item)">重新上架</c-button>
            </div>
            <c-table :data="detailList" :border="true">
              <c-table-column prop="packStatus" label="编目状态" show-overflow-tooltip width="180">
                <template slot-scope="scope">
                  <state-label :state="scope.row.packStatus" />
                </template>
              </c-table-column>
              <c-table-column prop="packUserName" label="发起人" show-overflow-tooltip width="260" />
              <c-table-column prop="packTime" label="时间" show-overflow-tooltip width="200" />
              <c-table-column prop="auditMsg" label="审核意见" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.auditMsg||'--' }}
                </template>
              </c-table-column>
            </c-table>
          </div>
        </c-collapse-item>
      </c-collapse>
    </div>
  </div>
</template>
<script>
import StateLabel from '@/views/pack-manage/common/state-label.vue'
import { queryVersionLog, queryVersionLogStatus, createActiveCommon } from '@/api/index'
import empty from '@/components/empty'
import topInfo from '@/views/pack-manage/common/top.vue'
export default {
  name: '',
  components: { StateLabel, empty, topInfo },
  data() {
    return {
      collapseActive: '',
      list: [],
      detail: {},
      detailList: []
    }
  },
  computed: {
    shopCode() {
      try {
        const shopCode = this.$route.params.shopCode || this.$route.query.shopCode || this.$store.state.publicManage.navList[0].shopCode
        return shopCode
      } catch (e) {
        return ''
      }
    }
  },
  watch: {
    shopCode: {
      handler(nv, ov) {
        if (nv && nv !== ov) {
          this.queryList()
        }
      },
      immediate: true
    }
  },
  methods: {
    collapseChange(item) {
      this.detail = {}
      this.detailList = []
      if (item !== '') this.queryDetail()
    },
    showSnapshoot(item) {
      this.$router.push({
        path: '/templateApp/snapshoot',
        query: {
          shopCode: this.shopCode,
          packVersion: item.packVersion,
          packVersionId: item.packVersionId
        }
      })
    },
    async queryList() {
      try {
        if (!this.shopCode) return (this.list = [])
        const res = await queryVersionLog({ shopCode: this.shopCode })
        this.list = res.data
        if (this.list.length === 1) {
          this.collapseActive = 0
          this.queryDetail()
        }
      } catch (e) {
        //
      }
    },
    async queryDetail() {
      try {
        const item = this.list[this.collapseActive]
        this.detail = { ...item }
        const param = {
          shopCode: this.shopCode,
          packVersion: item.packVersion,
          packVersionId: item.packVersionId
        }
        const res = await queryVersionLogStatus(param)
        this.detailList = res.data
      } catch (e) {
        //
      }
    },
    async clickPackAgain(item) {
      // 已下架-重新上架
      const params = { packVersionId: item.packVersionId, optType: 2 }
      // 创建活跃版本
      try {
        if (this.$store.state.publicManage.navList.length === 2) {
          const h = this.$createElement
          const confirmRes = await this.$confirm(h('p', null, [
            h('p', null, '存在未生效信息，继续操作将会覆盖当前内容，确定要继续吗？'),
            h('p', { style: 'font-size:12px;line-height:16px;margin-top:10px;' }, '若存在审核中信息，申请将被撤回后覆盖')
          ]), {
            title: '提示',
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            confirmButtonIsLeft: false,
            iconClass: 'c-ioc-icon-warning',
            type: 'warning'
          })
          if (confirmRes !== 'confirm') return
          // 覆盖已有活跃数据
          params.optStatus = 1
        }
        // 新增活跃版本
        await createActiveCommon(params)
        const list = await this.$store.dispatch('publicManage/getNavlist', { shopCode: this.shopCode, isList: true, type: 99 })
        const key = list[list.length - 1].key
        this.$store.dispatch('publicManage/setActiveNav', key)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.bg-white {
  min-height: 100%;
  padding-bottom: 20px;
}
.cls-history {
  overflow: auto !important;
  .flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 56px;
    padding-right: 8px;
    .title {
      padding-left: 26px;
      position: relative;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      font-size: 16px;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 56px;
        background: rgba(30, 111, 255, 0.2);
      }
    }
  }
  .is-active .flex .title::before {
    background: $primaryColor;
  }
  .cls-collapse {
    margin-top: 20px;
  }
  .detail {
    padding: 32px 40px;
    width: 100%;
    background: #F6F9FB;
    border-top: 1px solid #EDEDED;
    .row-item {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      width: 100%;
      color: #8A8A8A;
      &.right {
        position: relative;
        .c-button {
          position: absolute;
          right: 20px;
          top: -32px;
        }
      }
    }
    .label {
      width: 72px;
    }
    .value {
      // width: 1122px;
      line-height: 20px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      font-weight: 500;
      color: #4B4B4B;
    }
    .show-snapshoot {
      color: $primaryColor;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
::v-deep.c-collapse {
  .c-collapse-item__header {
    font-size: 14px;
    height: 56px;
    line-height: 56px;
  }
  .c-collapse-item__arrow {
    margin-right: 20px;
    &.c-icon-caret-bottom:before {
      content: '\e6df';
      font-weight: bold;
    }
    &.is-active {
      color: $primaryColor;
    }
  }
  .openText {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: normal;
    color: #4B4B4B;
  }
  .is-active .openText {
    color: $primaryColor !important;
  }
  .c-collapse-item__content {
    font-size: 14px;
    padding-bottom: 0;
  }
}
::v-deep.c-table {
  line-height: 14px;
  th {
    background: #F9FAFE;
  }
  tr {
    background: #FFFFFF;
  }
}
</style>
