<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import empty from '@/components/empty'
import { assetAppraiseList } from '@/api/index'
import { debounce } from '@l/utils'
import { applyTypeListMap } from '@/config/index'
export default {
  components: { empty },
  props: {
    shopCode: [String, Number]
  },
  data() {
    return {
      PREVIEW_URL: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      list: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 500,
        total: 0,
        hasNext: true
      },
      applyTypeListMap,
      loader: () => {}
    }
  },
  created() {
    this.loader = debounce(this.getList, 500)
    this.getList()
  },
  mounted() {
    // 不加true绑定不生效
    window.addEventListener('scroll', this.loader, true)
  },
  beforeDestroy() {
    // 不加true销毁不生效
    window.removeEventListener('scroll', this.loader, true)
  },
  methods: {
    async getList() {
      try {
        if (!this.pageInfo.hasNext) return
        const params = {
          shopCode: this.shopCode,
          pageNum: '',
          pageSize: ''
        }
        const res = await assetAppraiseList(params)
        this.pageInfo.pageNum = res.data.currPage + 1
        this.pageInfo.hasNext = res.data.hasNext
        this.pageInfo.pageSize = res.data.pageSize
        this.pageInfo.total = res.data.total
        const list = res.data.currPage === 1 ? [] : this.list
        res.data.list = res.data.list.map(d => ({
          ...d,
          attachment: (d.attachment && typeof d.attachment === 'string') ? (JSON.parse(d.attachment) || []) : []
        }))
        this.list = [].concat(list, res.data.list)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<template>
  <ul class="appraise-wrap appraiseDom">
    <empty v-if="!(list&&list.length)" text="尚无用户对此资源发表评价" />
    <li v-for="item,i in list" :key="i">
      <div class="flex justify-between">
        <div class="flex align-center">
          <div class="user"><i class="c-icon-user-solid"></i></div>
          <div>
            <p class="f-bold">{{ item.appraiseUserName }}</p>
            <p class="text-[12px]">
              <span class="mr-[12px]">{{ item.appraiseTime }}</span>
              <span class="mr-[12px]">{{ item.packVersion||'' }}</span>
              <span>{{ applyTypeListMap.get(+item.applyType)||'' }}</span>
            </p>
          </div>
        </div>
        <c-rate v-model="item.score" show-score score-template="{value}" disabled></c-rate>
      </div>
      <p class="mt-[16px]">{{ item.content }}</p>
      <div v-if="item.attachment&&item.attachment.length" class="mt-[16px]">
        <c-image
          v-for="img,ii in item.attachment"
          :key="ii"
          style="width:128px;height:128px;border-radius:4px;margin-right:12px;"
          :src="`${PREVIEW_URL}${img.filePath}`"
          :preview-src-list="[`${PREVIEW_URL}${img.filePath}`]"
          fit="cover"></c-image>
      </div>
      <div v-if="item.replyContent" class="reply mt-[16px]">
        <label class="f-bold">回复</label>
        <p class="mt-[8px]">{{ item.replyContent }}</p>
      </div>
    </li>
  </ul>
</template>
<style lang='scss' scoped>
.appraise-wrap {
  background: white;
  line-height: 22px;
  color: #4B4B4B;
  font-family: PingFang SC;
  font-size: 14px;
  li {
    padding: 28px;
    border-bottom: 1px solid #E4E9ED;
  }
  .f-bold {
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
  .user {
    width: 48px;
    height: 48px;
    line-height: 52px;
    margin-right: 16px;
    background: #E4E9ED;
    border-radius: 50%;
    text-align: center;
    i {
      color: white;
      font-size: 24px;
      font-weight: bold;
    }
  }
  .reply {
    width: 100%;
    background: #F6F9FB;
    padding: 16px 20px;
    p {
      color: #8A8A8A;
    }
  }
}
::v-deep.empty-wrapper{
  .empty-image {
    width: 300px;
  }
  .empty-text {
    font-size: 14px;
    bottom: 25px;
  }
}
</style>
