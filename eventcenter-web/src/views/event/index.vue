<!--
 * @description 事件管理layout
 * @date 2020-08-19
 * @author lism
-->
<template>
  <div class="event-container-wrapper">
    <!-- keep-alive 只对动态组件起效果 -->
    <keepAlive>
      <component :is="dyRoute" v-if="$route.meta.keepAlive" />
    </keepAlive>
    <component :is="dyRoute" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import typeIn from './typeIn'
import typeInAdd from './typeIn/add-edit'
import filter from './filter'
import review from './review'
import dispatch from './dispatch'
import handle from './handle'
import handleInfo from '@/components/EventInfo'
import handled from './handled'
import settle from './settle'
import settled from './settled'
import query from './query'
import cgHistory from './cgHistory'
import draft from './draft'
import approval from './approval'
import filterInfo from './filter/info'
import verify from './verify'
import verified from './verified'
import deWeight from './de-weight'
import merge from './merge'
import appraise from './appraise'
import preAccepted from './pre-accepted'
import preAcceptedInfo from './pre-accepted/detail'
import collection from './collection'
import thirdSelfHandle from './third-self-handle'
import deWeightDetail from './de-weight/detail.vue'
import { mapActions } from 'vuex'

export default {
  name: 'EventWrapper',
  computed: {
    dyRoute() {
      const { name = 'dispatch' } = this.$route
      const map = {
        typeIn,
        typeInAdd,
        typeInEdit: typeInAdd,
        typeInInfo: handleInfo,
        review,
        reviewInfo: handleInfo,
        dispatch,
        dispatchInfo: handleInfo,
        handle,
        handleInfo,
        handled,
        handledInfo: handleInfo,
        settle,
        settleInfo: handleInfo,
        settled,
        settledInfo: handleInfo,
        query,
        queryInfo: handleInfo,
        cgHistory,
        cgHistoryInfo: handleInfo,
        draft,
        approval,
        approvalInfo: handleInfo,
        filter,
        filterInfo,
        verify,
        verifyInfo: handleInfo,
        verified,
        verifiedInfo: handleInfo,
        deWeight,
        deWeightInfo: handleInfo,
        merge,
        mergeInfo: handleInfo,
        appraise,
        preAccepted,
        preAcceptedInfo,
        collectionUnsolved: collection,
        collectionAll: collection,
        thirdSelfHandle,
        deWeightDetail
      }
      return map[name]
    }
  },
  async created() {
    // 事件类型所有模块都要使用，故此在这里进行请求
    await this.getEventType()
    this.$store.dispatch('dispatch/getAllGrids')
  },
  methods: {
    ...mapActions('dispatch', ['getEventType'])
  }
}
</script>

<style lang="scss" scoped>
.event {
  &-container-wrapper {
    height: 100%;
  }
}
</style>
