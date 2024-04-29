<template>
  <div class="public-card">
    <div v-for="(cardInfo, index) in personList" :key="index" class="item">
      <div class="surName">
        {{ (cardInfo.linkmanName && cardInfo.linkmanName.substring(0, 1)) || "未知" }}
      </div>
      <div class="info">
        <div class="first">
          <div class="name">{{ cardInfo.linkmanName || "--" }}</div>
          <div class="number">{{ cardInfo.mobile || "--" }}</div>
        </div>
        <div class="second">{{ cardInfo.email || "--" }}</div>
        <div class="thrid">
          <div class="org">
            部门： {{
              cardInfo.orgRoleVoList &&
                cardInfo.orgRoleVoList[0] &&
                cardInfo.orgRoleVoList[0].orgName
            }}
          </div>
          <div class="role">
            角色： {{
              cardInfo.orgRoleVoList &&
                cardInfo.orgRoleVoList[0] &&
                cardInfo.orgRoleVoList[0].roleName
            }}
          </div>
        </div>
      </div>
      <el-dropdown
        v-if="cardInfo.orgRoleVoList && cardInfo.orgRoleVoList.length > 1"
        class="drop-body"
        title="更多"
      >
        <span class="el-dropdown-link">
          <i class="el-icon-more" />
        </span>
        <el-dropdown-menu slot="dropdown" class="drop-menu">
          <el-dropdown-item
            v-for="(item, index2) in cardInfo.orgRoleVoList &&
              cardInfo.orgRoleVoList.slice(1, cardInfo.orgRoleVoList.length )"
            :key="index2"
            class="drop-item"
          >
            <div class="org" :title="item && item.orgName"><span v-if="index2 === 0">部门：</span>{{ item && item.orgName }}</div>
            <div class="role" :title="item && item.roleName"><span v-if="index2 === 0">角色：</span>{{ item && item.roleName }}</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PublicCard',
  props: {
    personList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.public-card {
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
    .edit-btns {
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
      .thrid {
        .org,
        .role {
          width: 195px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #8a8a8a;
          font-weight: 400;
          padding-bottom: 5px;
        }
      }
    }
    .drop-body {
      cursor: pointer;
      position: absolute;
      right: 20px;
      bottom: 15px;
      transform: rotate(90deg);
      color: #bdbdbd;
      .el-icon-more:hover {
        color: #36a4ff;
      }
    }
  }
}
.drop-item {
  display: flex;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #8a8a8a;
  font-weight: 400;
   &:not(:first-child) {
      padding-left: 58px;
    }
  .org,
  .role {
    width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    color: #8a8a8a;
    // padding-right: 5px;

  }
  &:hover {
    background: #fff;
  }
}
</style>
