<template>
  <div class="page-container">
    <keepAlive>
      <component :is="dyRoute" v-if="$route.meta.keepAlive" />
    </keepAlive>
    <component :is="dyRoute" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import accrualList from './accrualList'
import accrualSet from './accrualList/accrualSet.vue'
import eventType from './eventType'
import eventTypeLeaf from './eventType/leaf.vue'
import eventTypeLeafInfo from './eventType/leaf-info.vue'
import setting from './setting'
import disScopeConfig from './disScopeConfig'
import processModel from './processModel'
import processList from './processModel/processList'
import processDraw from './processModel/process-draw'
import nodeConfig from './processModel/nodeConfig'
import dict from './dict'
import appraiseModule from './appraise'
import appraiseTarget from './appraise-target'
import deWeight from './de-weight'
import overTime from './over-time'
import requestAuth from './requestAuth'
import evtChange from './evtchange'
import transition from './transition'
import instructAccept from './instruct-accept'
import standardized from './standardized'
import dutyDept from './duty-dept'

export default {
  name: 'StrategyConfig',
  computed: {
    dyRoute() {
      const { name = 'accrualList' } = this.$route
      const map = {
        accrualList,
        accrualSet,
        eventType,
        setting,
        disScopeConfig,
        processModel,
        processList,
        processDraw,
        nodeConfig,
        dict,
        appraiseModule,
        appraiseTarget,
        deWeight,
        overTime,
        requestAuth,
        evtChange,
        transition,
        instructAccept,
        eventTypeLeaf,
        eventTypeLeafInfo,
        standardized,
        dutyDept
      }
      return map[name]
    }
  }
}
</script>
