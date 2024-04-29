<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-02-10
-->
<template>
  <div class="download-main">
    <div class="header">
      <div class="search-box">
        <c-menu :default-active="activeIndex" active-text-color="#36A4FF" text-color="#4b4b4b"
                class="c-menu-download" mode="horizontal" @select="handleSelect">
          <c-menu-item index="">全部应用</c-menu-item>
          <component :is="item.childList&&item.childList.length?'c-submenu':'c-menu-item'"
                     v-for="item in typeTreeData" :key="item.groupId"
                     popper-class="c-menu-download-sub" :index="item.groupId+''">
            <template slot="title">{{ item.groupName }}</template>
            <c-menu-item v-for="_item in item.childList" :key="_item.groupId"
                         :index="_item.groupId+''">{{ _item.groupName }}</c-menu-item>
          </component>
        </c-menu>
      </div>
      <div class="info-box lp-data-controls">
        <total-info :search="hasSearch" :total="page.total" />
        <c-input-search v-model="keyword" style="width:296px" placeholder="请输入关键字进行模糊查询"
                        @search="submit"></c-input-search>
      </div>
    </div>
    <div v-infinite-scroll="load" class="content" :infinite-scroll-distance="300"
         :infinite-scroll-delay="200" :infinite-scroll-disabled="noMore">
      <ul class="list">
        <assetsCard v-for="item in assetsList" :key="item.assetId" :data="item" class="assets-item"
                    :page-key="'appDownload'" :download-flag="true" @downloadOpen="downloadOpen">
        </assetsCard>
      </ul>
    </div>
  </div>
</template>

<script>

import { downloadList } from '@/api/index'
import assetsCard from '@/views/application-management/components/assets-card.vue'
export default {
  components: {
    assetsCard
  },
  data() {
    return {
      activeIndex: '',
      typeTreeData: [
        // 1-PC、2-大屏、3-APP
        // { groupId: 1, groupName: 'APP' },
        // { groupId: 2, groupName: '大屏' },
        { groupId: 3, groupName: 'PC' },
        { groupId: 4, groupName: 'H5' }

      ],
      hasSearch: false,
      noMore: false,
      keyPath: [],
      keyword: '',
      assetsList: [],
      page: {
        total: 0,
        pageNum: 0,
        pageSize: 20
      }
    }
  },
  created() {
    // this.load()
  },
  methods: {
    handleSelect(key, keyPath) {
      this.keyPath = keyPath
      this.page.pageNum = 0
      this.assetsList = []
      // this.noMore = false
      this.$nextTick(() => {
        console.log(this.assetsList, key, keyPath);
        this.load()
      })
    },
    submit() {
      this.page.pageNum = 0
      this.assetsList = []
      // this.noMore = false
      this.$nextTick(() => {
        this.load()
      })
    },
    load() {
      this.page.pageNum += 1
      console.log('------')
      downloadList({
        packName: this.keyword,
        packType: 2,
        assetType: 99, // 应用
        assetSubtype: this.keyPath[0],
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        optType: 1
      }).then(res => {
        this.page.total = res.data.total
        this.assetsList = [].concat(this.assetsList, res.data.list.map(item => {
          item.assetCode = item.shopCode
          item.status = 5
          item.assetName = item.packName
          item.version = item.packVersion
          item.subtype = item.assetSubtype
          return item
        }))
        this.noMore = !res.data.hasNext
      })
    },
    downloadOpen(row) {
      console.log(row)
      if (window.__systemConfig && window.__systemConfig.assetShopUrl) {
        window.open(`${window.__systemConfig.assetShopUrl}templateApp/snapshoot?shopCode=${row.shopCode}&packVersion=${row.packVersion}&packVersionId=${row.packVersionId}`)
      } else {
        this.$message.warning('没有获取到资源商城平台跳转地址，请刷新页面后重试')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.download-main {
  .header {
    display: block;
    background-color: #fff;
    &::v-deep {
      .c-menu.c-menu--horizontal {
        border-bottom: 0px solid;
      }
      .c-menu-item {
        height: 64px;
        line-height: 64px;
        padding: 0 0px;
        margin-right: 48px;
      }
      .c-submenu__title {
        height: 64px;
        line-height: 64px;
        padding: 0px;
        margin-right: 48px;
        i {
          color: #4b4b4b;
        }
      }
      .is-active .c-submenu__title i {
        color: $primaryColor;
      }
    }
  }
  .info-box {
    padding: 22px 20px;
  }
  .search-box {
    border-bottom: 1px solid #ededed;
    padding-left: 24px;
  }
  .content {
    overflow: auto;
    padding: 0px 0 0px;
    margin-top: 20px;
    height: calc(100vh - 256px);
    .list {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
      width: 1619px;
      margin: auto;
    }
    .assets-item {
      margin-bottom: 20px;
      margin-right: 18px;
      &:nth-child(5n) {
        margin-right: 0px;
      }
    }
  }
}
</style>
