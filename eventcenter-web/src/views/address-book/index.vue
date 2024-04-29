<!--/**
 *通讯录
 *@param: {}
 *@return {}
 *@author: xjt 2021/12/21
*/-->
<template>
  <div class="page-container">
    <div class="strategy-config-accrual-list">
      <div class="search-tree">
        <!-- 需要添加内部滚动 -->
        <el-scrollbar style="height: 100%">
          <contact-tree @nodeClick="nodeClick" @personClick="personClick" />
        </el-scrollbar>
      </div>
      <div class="content-right">
        <fixed-page padding="0" :footer-height="76" :footer-margin="288">
          <template v-slot:header>
            <search-panel label-width="100" @search="getData" @reset="reset">
              <panel-item label="姓名">
                <el-input
                  v-model="form.linkmanName"
                  type="text"
                  placeholder="请输入内容"
                />
              </panel-item>
              <panel-item label="联系方式">
                <el-input v-model="form.mobile" type="text" placeholder="请输入内容" />
              </panel-item>
            </search-panel>
          </template>
          <template>
            <div class="result">
              <search-tips
                ref="searchTips"
                class="tip-btns"
                :total="page.total"
                :show-actions="true"
              >
                <slot>
                  <el-button
                    v-if="currentType === 'person'"
                    type="primary"
                    class="add-btn common-action-btn"
                    icon="custom-add common-icon"
                    @click.stop="addContact()"
                  >新增联系人</el-button>
                  <div
                    v-else
                    class="sort-btn"
                    :class="{ sortting: sortting === 1 }"
                    @click="toSort"
                  >
                    <i class="el-icon-right" />
                    <span>AZ</span>
                  </div>
                </slot>
              </search-tips>
              <person-card
                v-if="currentType === 'person'"
                :person-list="personList"
                @refresh="getData"
              />
              <public-card v-else :person-list="personList" />
            </div>
          </template>
          <!-- 分页组件中批量删除先隐藏  @patchRemove="patchRemove" del-flag-->
          <template v-slot:footer>
            <cestc-pagination
              :current-page.sync="page.pageNum"
              :page-size="page.pageSize"
              :total="page.total"
              layout="total,prev,pager,next,jumper"
              @current-change="handleCurrentChange"
            />
          </template>
        </fixed-page>
      </div>
    </div>
    <add-contact
      v-if="addContactFlag"
      :visible.sync="addContactFlag"
      @update:visible="visible = $event"
      @confirm="addConfirm"
    />
  </div>
</template>

<script>
import addContact from './components/addContact'
import { mapActions } from 'vuex'
import moduleSrv from '@/api/dispatch'
import contactTree from './components/contactTree.vue'
import PersonCard from './components/personCard.vue'
import PublicCard from './components/publicCard.vue'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'AccrualList',
  components: {
    addContact,
    contactTree,
    PersonCard,
    PublicCard
  },
  data() {
    return {
      addContactFlag: false,
      form: {}, // 检索条件表单
      personList: [],
      tableColumn: [
        // 表格全量
        {
          prop: 'eventTypeLName',
          label: '事件大类',
          visible: true
        },
        {
          prop: 'eventTypeMName',
          label: '事件中类',
          visible: true
        },
        {
          prop: 'eventTypeName',
          label: '事件小类',
          visible: true
        },
        {
          prop: 'eventTypeDesc',
          label: '小类描述',
          visible: true
        },
        {
          prop: 'orgTypeText',
          label: '处置级别',
          visible: true
        },
        {
          prop: 'roleName',
          label: '处置角色',
          visible: true
        }
      ],
      page: {
        pageNum: 1,
        total: 0,
        pageSize: 12
      },
      orgsOptions: [],
      roleOptions: [],
      selectedCollection: [], // 选择集合
      treeProps: {
        label: 'name',
        children: 'children'
      },
      dialogVisible: false,
      dialogData: null,
      searchTipsHeight: 0,
      currentNode: {},
      clickNode: {},
      sortting: '',
      currentType: 'person' // person 个人 ，publick 公共
    }
  },

  computed: {
    columns() {
      return this.tableColumn.filter((item) => item.visible)
    },
    orgTypeMapper() {
      const map = new Map()
      this.orgsOptions.forEach((item) => {
        map.set(item.orgType, item.orgTypeName)
      })
      return map
    },
    tableContentHeight() {
      return `calc(100% - ${this.searchTipsHeight}px - 20px)`
    }
  },
  async created() {
    // 获取权责清单处置级别接口
    await this.getOrgTyps()
    await this.getEventType()
    this.getData() // 获取列表 // person 个人 ，publick 公共
  },
  mounted() {
    this.$nextTick(() => {
      this.searchTipsHeight = this.$refs?.searchTips?.$el?.clientHeight
    })
  },
  methods: {
    ...mapActions('dispatch', ['getEventType']),
    nodeClick(data) {
      this.currentType = 'publick'
      this.clickNode = data
      this.getData()
    },
    // 个人通讯录联系人列表
    personClick(data) {
      this.currentType = 'person'
      this.clickNode = data
      this.getData()
    },
    // 处置部门和处置角色
    getOrgTyps() {
      moduleSrv.getOrgTypes().then((res) => {
        const { orgTypes = [], roles = [] } = res.data
        if (res.code === SUCCESS_CODE) {
          this.orgsOptions = orgTypes
          this.roleOptions = roles
        }
      })
    },
    addContact() {
      this.addContactFlag = true
    },
    // 添加联系人
    addConfirm(form) {
      const addrBookGroupLinkmanVo = {
        ...form
      }
      moduleSrv.updateAddrbookgroupLinkman(addrBookGroupLinkmanVo).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            message: res.message || '添加成功！',
            type: 'success'
          })
          this.addContactFlag = false
          this.getData()
        } else {
          this.$message({
            message: res.message || '操作失败',
            type: 'error'
          })
        }
      })
    },
    // 重置
    reset() {
      this.form = {}
      this.getData()
    },
    // 获取联系人
    getData() {
      const { pageNum = 1, pageSize = 12 } = this.page
      const { linkmanName, mobile } = this.form
      const params = {
        pageNum,
        pageSize,
        sortType: this.sortting
      }
      if (this.currentType === 'person') {
        const addrBookGroupLinkmanVo = {
          ...params,
          groupId: this.clickNode?.id,
          linkmanName, mobile
        }
        moduleSrv.getLinkmanPage(addrBookGroupLinkmanVo).then((res) => {
          if (res.code === SUCCESS_CODE) {
            const { list = [], total = 0 } = res.data
            this.personList = list
            this.page.total = total
          }
        })
      } else if (this.currentType === 'publick') {
        const ucUserQueryVo = {
          ...params,
          orgId: this.clickNode?.id,
          name: linkmanName,
          phone: mobile
        }
        moduleSrv.getUserOrgPageList(ucUserQueryVo).then((res) => {
          if (res.code === SUCCESS_CODE) {
            const { list = [], total = 0 } = res.data
            this.personList = list.map((item) => {
              return {
                ...item,
                linkmanName: item.name,
                mobile: item.phone
              }
            })
            this.page.total = total
          }
        })
      }
    },

    // 翻页查询
    handleCurrentChange(current) {
      this.page.currentPage = current
      this.getData()
    },
    // 排序
    toSort() {
      this.sortting = this.sortting ? '' : 1
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.strategy-config {
  &-accrual-list {
    display: flex;
    .search-tree {
      flex: 0 0 272px;
      width: 272px;
      margin: 0 16px 16px 0;
      .el-scrollbar {
        background-color: $white;
      }
    }
    .content-right {
      flex: 1;
      width: calc(100% - 292px);
      overflow-y: auto;
      // padding-bottom: 60px; // 避免内容被分页遮挡
      display: flex;
      flex-direction: column;
      ::v-deep .el-form {
        .el-form-item {
          margin-right: 24px;
          .el-form-item__label {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #4b4b4b;
            font-weight: 400;
          }
          .el-form-item__content {
            .el-input__inner {
              height: 32px;
              border: 1px solid #e7e7e7;
              border-radius: 2px;
              &:focus {
                border-color: #36a4ff;
              }
            }
          }
        }
      }
      .result {
        flex: 1; // 如果有兼容问题，再写一个 height: calc()
        background-color: $white;
        .tip-btns {
          padding-right: 0;
        }
        .sort-btn {
          cursor: pointer;
          width: 32px;
          height: 32px;
          background: #fff;
          border: 1px solid #e7e7e7;
          border-radius: 2px;
          position: relative;
          .el-icon-right {
            font-size: 12px;
            color: #4b4b4b;
            position: absolute;
            top: 3px;
            left: 7px;
          }
          span {
            position: absolute;
            top: 11px;
            left: 6px;
          }
        }
        .sortting {
          border: 1px solid #36a4ff;
          color: #36a4ff;
          .el-icon-right {
            color: #36a4ff;
          }
        }
      }
    }
  }
}
</style>
