<template>
  <div class="person-card">
    <div v-for="(cardInfo, index) in personList" :key="index" class="item">
      <div class="surName">
        {{ (cardInfo.linkmanName && cardInfo.linkmanName.substring(0, 1)) || "未知" }}
      </div>
      <el-dropdown
        trigger="click"
        class="grop-drowp"
        placement="bottom"
        @command="handleCommand(...arguments)"
      >
        <i class="el-icon-more" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :command="commandValue('a', cardInfo)"
            class="edit-btn"
          >编辑</el-dropdown-item>
          <el-dropdown-item
            :command="commandValue('b', cardInfo)"
            class="remove-btn"
          >删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="info">
        <div class="first">
          <div class="name">{{ cardInfo.linkmanName || "--" }}</div>
          <div class="number">{{ cardInfo.mobile || "--" }}</div>
        </div>
        <div class="second">{{ cardInfo.email || "--" }}</div>
        <div class="desc">
          {{ cardInfo.remark || "--" }}
        </div>
      </div>
    </div>
    <add-contact
      v-if="addContactFlag"
      :edit-obj="editObj"
      :visible.sync="addContactFlag"
      @update:visible="visible = $event"
      @confirm="addConfirm"
    />
  </div>
</template>
<script>
import addContact from './addContact'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'PersonCard',
  components: { addContact },
  props: {
    personList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      addContactFlag: false
    }
  },
  methods: {
    addContact() {
      this.addContactFlag = true
    },
    // 修改联系人
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
          this.$emit('refresh')
        } else {
          this.$message({
            message: res.message || '操作失败',
            type: 'error'
          })
        }
      })
    },
    commandValue(type, command) {
      return {
        type: type,
        command: command
      }
    },
    handleCommand({ type, command }) {
      if (type === 'a') {
        this.addContactFlag = true
        this.editObj = command
      }
      if (type === 'b') {
        this.removeNode(command)
      }
    },
    // 删除联系人
    removeNode(node) {
      moduleSrv.deleteLinkmanByIds([node.id]).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            type: 'success',
            message: res.message || '操作成功'
          })
          this.$emit('refresh')
        } else {
          this.$message({
            type: 'error',
            message: res.message || '操作失败'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.person-card {
  display: flex;
  flex-wrap: wrap;
  .item:nth-child(4n) {
    margin-right: 0 !important;
  }
  .item {
    padding: 20px;
    margin: 0 20px 20px 0;
    box-sizing: border-box;
    display: flex;
    width: calc((100% - 60px) / 4);
    min-width: 308px;
    height: 156px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 0px 10px 8px #eee;
    border-radius: 4px;
    position: relative;
    .surName {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(54, 164, 255, 0.06);
      border-radius: 50%;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #36a4ff;
      font-weight: 500;
      margin-right: 16px;
    }
    .grop-drowp {
      position: absolute;
      right: 20px;
      top: 10px;
      .el-icon-more {
        color: #36a4ff;
        cursor: pointer;
      }
    }
    .info {
      flex: 1;
      .first {
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        .name {
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #202020;
          font-weight: 600;
          max-height: 46px;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .number {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #202020;
          font-weight: 400;
          padding-right: 5px;
        }
      }
      .second {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4b4b4b;
        font-weight: 400;
        margin-bottom: 14px;
      }
      .desc {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #8a8a8a;
        font-weight: 400;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
    }
  }
}
</style>
