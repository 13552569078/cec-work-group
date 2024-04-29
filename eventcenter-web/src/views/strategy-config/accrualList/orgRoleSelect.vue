<template>
  <div class="org-role-select">
    <div class="org-div">
      <div class="top-head">组织架构</div>
      <div class="orgs-checks">
        <div class="org-search">
          <el-input v-model="orgFilterText" placeholder="请输入组织名称">
            <template slot="suffix">
              <img src="@/assets/search.png" class="img" alt="">
            </template>
          </el-input>
        </div>
        <div class="check-section">
          <el-tree
            ref="orgTree"
            :data="options"
            node-key="id"
            :expand-on-click-node="false"
            icon-class-fold="el-icon-caret-right"
            icon-class-unfold="el-icon-caret-bottom"
            :filter-node-method="filterNode"
            :highlight-current="false"
            :default-expanded-keys="defaultExpandedKeys"
          >
            <span slot-scope="{ node, data }" :class="`custom-tree-node custom-tree-node-${activeOrg.id === data.id}`">
              <el-checkbox v-if="!isSingle" v-model="data.check" :disabled="data.disabled" :indeterminate="data.indeterminate" @change="orgChange($event,data)" />
              <span class="org-name" @click.stop="orgClick(data)">{{ data.name }}</span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
    <div v-loading="rolesLoading" class="org-div role-div">
      <div class="top-head">
        <el-checkbox
          v-model="roleAllCheck"
          :disabled="filterRoles.length === 0 || isSingle"
          :indeterminate="roleIndeterminate"
          @change="roleAllChange"
        />
        <div>全部角色或人员</div>
      </div>
      <div class="orgs-checks">
        <div class="org-search">
          <el-input v-model="roleFilterText" placeholder="请输入角色或人员名称">
            <template slot="suffix">
              <img src="@/assets/search.png" class="img" alt="">
            </template>
          </el-input>
        </div>
        <div class="check-section">
          <div class="org-list role-list">
            <div
              v-for="item in filterRoles"
              :key="item.id"
              :class="`org-item role-item`"
            >
              <el-checkbox v-model="item.check" @change="roleChange($event,item)" />
              <div class="org-name">{{ item.name }}</div>
            </div>
          </div>
          <div v-if="!activeOrg.id" class="no-tip no-tip-1">请点击右侧组织查询角色</div>
          <div v-if="activeOrg.id && !rolesLoading && !displayRoles.length" class="no-tip no-tip-1"><i class="el-icon-warning-outline" />当前组织({{ activeOrg.name }})未查询到角色</div>
        </div>
      </div>
    </div>
    <div class="selected-div">
      <div class="top-head">已选角色或人员（{{ selectedOrgRoles.length }}）<div v-if="selectedOrgRolesFilter.length" class="clear-all" @click="clear">清除</div></div>
      <div class="org-search">
        <el-input
          v-model="selFilterText"
          placeholder="请输入角色或人员名称"
        >
          <template slot="suffix">
            <img src="@/assets/search.png" class="img" alt="">
          </template>
        </el-input>
      </div>
      <div class="s-list">
        <div
          v-for="({org,role}, index) in selectedOrgRolesFilter"
          :key="index"
          class="sel-tag"
        >
          {{ org.name }} / {{ role.name
          }}<i class="el-icon-close" @click.stop="delRole(org,role)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/api/dispatch'
export default {
  name: 'EventcenterWebOrgRoleSelect',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    orgMap: {
      type: Object,
      default: () => {}
    },
    isSingle: {
      type: Boolean,
      default: false
    },
    defaultVal: {
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {
      orgAllCheck: false,
      orgIndeterminate: false,
      orgFilterText: '',
      activeOrg: {},
      displayRoles: [],
      roleAllCheck: false,
      roleIndeterminate: false,
      roleFilterText: '',
      selFilterText: '',
      selectedOrgRoles: [],
      defaultExpandedKeys: [],
      rolesLoading: false
    }
  },
  computed: {
    filterRoles() {
      if (this.roleFilterText) {
        return this.displayRoles.filter(
          (item) => item.name.indexOf(this.roleFilterText) > -1
        )
      }
      return this.displayRoles
    },
    selectedOrgRolesFilter() {
      if (this.selFilterText) {
        return this.selectedOrgRoles.filter(orgRole => orgRole.org.name.indexOf(this.selFilterText) > -1 || orgRole.role.name.indexOf(this.selFilterText) > -1)
      }
      return this.selectedOrgRoles
    }
  },
  watch: {
    selectedOrgRoles(arr) {
      this.$emit('change', arr)
    },
    orgFilterText() {
      this.$refs.orgTree && this.$refs.orgTree.filter(this.orgFilterText)
    }
  },
  created() {
    this.echoCheck()
  },
  methods: {
    isOrgDisable(org) {
      return Object.prototype.hasOwnProperty.call(org, 'roles') && org.roles.length === 0
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    orgClick(org) {
      if (this.activeOrg?.id === org.id) return
      this.activeOrg = org
      this.getOrgRoles()
    },
    orgChange(check, org) {
      this.activeOrg = org
      this.getOrgRoles(true)
    },
    async getOrgRoles(isOrgCheck) {
      try {
        this.rolesLoading = true
        this.displayRoles = []
        const res = this.activeOrg.roles ? { data: this.activeOrg.roles } : await service.getRoleByOrg({ orgId: this.activeOrg.id })
        const arr = res?.data || []
        if (isOrgCheck) {
          arr.forEach(role => {
            role.check = this.activeOrg.check
            const idx = this.selectedOrgRoles.findIndex(orgRole => orgRole.org.id === this.activeOrg.id && orgRole.role.id === role.id)
            if (this.activeOrg.check && idx > -1) this.selectedOrgRoles.splice(idx, 1)
          })
        } else {
          arr.forEach(role => {
            const idx = this.selectedOrgRoles.findIndex(orgRole => orgRole.org.id === this.activeOrg.id && orgRole.role.id === role.id)
            role.check = idx > -1
          })
        }
        if (!this.activeOrg.roles) this.activeOrg.roles = arr
        if (arr.length === 0) this.activeOrg.disabled = true
        // 判断是否已经选过了
        this.displayRoles = this.activeOrg.roles
        this.roleChange()
      } finally {
        this.rolesLoading = false
      }
    },
    roleChange(roleCheck, role) {
      if (this.isSingle && role) {
        this.selectedOrgRoles = []
        this.displayRoles.forEach(drole => {
          if (drole.id !== role.id) drole.check = false
        })
      }
      const roleCheckArr = this.displayRoles.filter((ritem) => ritem.check)
      const roleNoCheckArr = this.displayRoles.filter((ritem) => !ritem.check)
      this.roleIndeterminate =
        roleCheckArr.length > 0 &&
        roleCheckArr.length < this.displayRoles.length
      this.roleAllCheck =
        roleCheckArr.length > 0 &&
        roleCheckArr.length === this.displayRoles.length
      this.activeOrg.indeterminate = this.roleIndeterminate
      this.activeOrg.check = this.roleAllCheck
      if (roleCheckArr.length) {
        roleCheckArr.forEach(role => {
          const idx = this.selectedOrgRoles.findIndex(orgRole => orgRole.org.id === this.activeOrg.id && orgRole.role.id === role.id)
          if (idx === -1) this.selectedOrgRoles.push({ org: this.activeOrg, role })
        })
      }
      if (roleNoCheckArr.length) {
        roleNoCheckArr.forEach(role => {
          const idx = this.selectedOrgRoles.findIndex(orgRole => orgRole.org.id === this.activeOrg.id && orgRole.role.id === role.id)
          if (idx > -1) this.selectedOrgRoles.splice(idx, 1)
        })
      }
    },
    roleAllChange(allCheck) {
      this.roleIndeterminate = false
      this.roleAllCheck = allCheck
      this.displayRoles.forEach((item) => {
        item.check = allCheck
      })
      this.roleChange()
    },

    delRole(org, role) {
      if (this.orgMap[org.id] && this.orgMap[org.id].roles) {
        const roles = this.orgMap[org.id].roles
        const idx = roles.findIndex(rl => rl.id === role.id)
        if (idx > -1) roles[idx].check = false
        const checkedRoles = roles.filter(rl => rl.check)
        this.orgMap[org.id].check = checkedRoles.length === roles.length
        this.orgMap[org.id].indeterminate = checkedRoles.length > 0 && checkedRoles.length < roles.length
      }
      const sIdx = this.selectedOrgRoles.findIndex(orgRole => orgRole.org.id === org.id && orgRole.role.id === role.id)
      this.selectedOrgRoles.splice(sIdx, 1)
      this.roleChange()
    },
    clear() {
      for (const key in this.orgMap) {
        this.orgMap[key].check = false
        this.orgMap[key].indeterminate = false
        if (this.orgMap[key]?.roles?.length) {
          this.orgMap[key]?.roles.forEach(role => {
            role.check = false
          })
        }
      }
      this.roleAllCheck = false
      this.roleIndeterminate = false
      this.selectedOrgRoles = []
    },
    // 初始化回显
    async echoCheck() {
      console.log('this.defaultVal', this.defaultVal)
      // 初始化回显
      const chekedList = []
      if (this.isSingle && this.defaultVal && this.defaultVal.id) {
        this.defaultExpandedKeys = [this.defaultVal.id]
        const res = await service.getRoleByOrg({ orgId: this.defaultVal.id })
        const roles = res.data || []
        roles.forEach(role => {
          role.check = role.id === this.defaultVal.roleId
          if (role.check) chekedList.push({ org: this.orgMap[this.defaultVal.id], role })
        })
        this.orgMap[this.defaultVal.id].roles = roles
        this.activeOrg = this.orgMap[this.defaultVal.id]
        this.displayRoles = roles
      }
      if (!this.isSingle && this.defaultVal?.length) {
        const defaultExpandedKeys = []
        const defaultOrgRolesMap = {}
        this.defaultVal.forEach(item => {
          if (item?.id) {
            defaultExpandedKeys.indexOf(item.id) === -1 && defaultExpandedKeys.push(item.id)
            if (!defaultOrgRolesMap[item.id]) {
              defaultOrgRolesMap[item.id] = [item]
            } else {
              defaultOrgRolesMap[item.id].push(item)
            }
          }
          this.defaultExpandedKeys = defaultExpandedKeys
        })
        for (const key in defaultOrgRolesMap) {
          const res = await service.getRoleByOrg({ orgId: key })
          const roles = res.data || []
          roles.forEach(role => {
            role.check = defaultOrgRolesMap[key].some(orgRole => role.id === orgRole.roleId)
            if (role.check) chekedList.push({ org: this.orgMap[key], role })
          })
          const checkedRoles = roles.filter(role => role.check)
          this.orgMap[key].check = roles.length > 0 && roles.length === checkedRoles.length
          this.orgMap[key].indeterminate = roles.length > 0 && roles.length > checkedRoles.length
          this.orgMap[key].roles = roles
          // 默认展示第一个
          if (defaultExpandedKeys.length && `${defaultExpandedKeys[0]}` === `${key}`) {
            this.activeOrg = this.orgMap[key]
            this.displayRoles = roles
          }
        }
      }
      if (chekedList.length) this.selectedOrgRoles = chekedList
    }
  }
}
</script>

<style lang="scss" scoped>
.org-role-select {
  height: 452px;
  display: flex;
  border: 1px solid #e7e7e7;
  margin-top: 12px;
  .org-search {
    padding: 9px 20px;
    ::v-deep {
      .el-input__suffix {
        width: 32px;
        height: 32px;
        background: transparent;
        border-radius: 0px;
        border: none;
        border-left: 0px;
        padding: 0;
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  .top-head {
    height: 54px;
    background: #f9fafe;
    border-radius: 2px 0px 0px 0px;
    padding-left: 16px;
    display: flex;
    align-items: center;
    position: relative;

    div {
      margin-left: 16px;
    }
    .clear-all {
        position: absolute;
        right: 20px;
        top: 16px;
        color: #36A4FF;
        cursor: pointer;
    }
  }
  .el-checkbox {
    line-height: 16px;
  }
  .org-div {
    width: 378px;
    height: 100%;
    flex-shrink: 0;
    border-right: 1px solid #e7e7e7;

    .orgs-checks {
      height: calc(100% - 54px);
      .check-section {
        height: calc(100% - 51px);
        overflow-y: auto;
        padding-left: 20px;
        .el-tree{
          ::v-deep {
            .el-tree-node__content{
              height: 32px;
              color: #555555;
              &:has(.custom-tree-node-true) {
                background: #F9FAFE;
              }
              .custom-tree-node{
                display: flex;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100%;
                align-items: center;
                .el-checkbox {
                  margin-right: 4px;
                  flex-shrink: 0;
                }
                .org-name {
                  position: relative;
                  top: 2px;
                  flex: 1;
                }
              }
            }
          }
        }
        .org-list {
          .org-item {
            padding-left: 66px;
            height: 32px;
            display: flex;
            align-items: center;
            .org-name {
              margin-left: 8px;
              font-size: 14px;
              color: #555;
              cursor: pointer;
            }
            &:hover,
            &-true {
              background: #f9fafe;
            }
            &.role-item {
              padding-left: 28px;
              .org-name {
                cursor: default;
              }
            }
          }
        }
      }
    }
  }
  .role-div {
    width: 378px;
    height: 100%;
    flex-shrink: 0;
  }
  .selected-div {
    height: 100%;
    flex: 1;
    .s-list {
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      align-content:flex-start;
      height: calc(100% - 105px);
      overflow-y: auto;
      .sel-tag {
        margin-bottom: 20px;
        height: 33px;
        background: #f9fafe;
        border-radius: 2px;
        line-height: 33px;
        margin-right: 20px;
        padding: 0 16px;
        i {
          margin-left: 18px;
          cursor: pointer;
          &:hover {
            color: #36a4ff;
          }
        }
      }
    }
  }
  .no-tip {
    color: #666;
    text-align: center;
    i{
      margin-right: 6px;
    }
  }
}
</style>
