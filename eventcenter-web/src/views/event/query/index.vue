<!--
 * @description 事件管理-事件查询，不是router-view顶级组件，无法监听beforeRouteLeave
 * @date 2020-08-19
 * @author lism
-->
<template>
  <event-common-list
    ref="eventCommon"
    :hidden-search-list="hiddenSearchList"
    :hidden-columns-list="hiddenColumnsList"
    :event-type="EVENT_TYPE_ENUM.query"
    :action-width="110"
  >
    <template v-slot="{ row }">
      <span class="action-btn" @click="_showInfo(row)">查看</span>
      <span v-for="(item, index) in allBtnList" :key="index" class="action-btn" @click="handleCommand({ code: item.code, row })">{{ item.name }}</span>
    </template>
  </event-common-list>
</template>

<script>
import EventCommonList from '../components/EventCommonList'
import { EVENT_TYPE_ENUM } from '@/views/event/components/eventTypeEnum'
import moduleSrv from '@/api/dispatch'
import moduleSrv1 from '@/api/user'
import { mapGetters } from 'vuex'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Query',
  components: {
    EventCommonList
  },
  data() {
    return {
      EVENT_TYPE_ENUM,
      allBtnList: [],
      hiddenSearchList: ['whistleNum', 'eventDesc'], // 隐藏的搜索条件
      hiddenColumnsList: ['applyType', 'whistleLevel', 'eventDesc'] // 隐藏的展示列
    }
  },
  computed: {
    ...mapGetters(['appCode'])
  },
  created() {
    this.getControlBtns()
  },
  methods: {
    getRouteMenuId(path) {
      if (!path) return ''
      const list = this.$store.getters.menuList || []
      let id = ''
      const traverse = (data) => {
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          if (item.path && item.path === path) {
            id = item.id
            return
          } else traverse(item.children || [])
        }
      }
      traverse(list)
      return id
    },
    getControlBtns() {
      const params = {
        appCode: String(this.appCode),
        resTypeList: ['B'],
        roleId: this.$store.getters?.profile?.currentOrgRole?.role?.id || '',
        id: this.getRouteMenuId('/event/query')
      }
      moduleSrv1.getMenuList(params).then(res => {
        if (res.code === 0) {
          this.allBtnList = res?.data || []
        }
      })
    },
    handleCommand({ code, row }) {
      const fnMap = {
        'btn-query-delete': '_delete'
      }
      this[fnMap[code]](row)
    },
    _delete(row) {
      this.$confirm('事件数据删除将无法修改，确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          eventIds: [row.id]
        }
        moduleSrv.batchDelete(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.$refs.eventCommon._search()
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    },
    // 查看详情
    _showInfo(row) {
      this.$router.push({
        path: '/event/query/info',
        query: {
          taskId: row.taskId,
          id: row.id,
          refresh: true
        }
      })
    }
  }
}
</script>
