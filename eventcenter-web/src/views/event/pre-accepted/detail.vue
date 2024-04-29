<!--
@Author: lism
@Description: 预受理事件详情和信息补录
@Date: 2023-11-14
-->
<template>
  <div class="page-wrapper">
    <div class="content">
      <div class="left">
        <div class="event-head">
          <common-title title="事件详情" />
          <div :class="`e-state e-state-${form.acceptState}`">
            <svg-icon v-if="form.acceptState === '1'" icon-class="svg-warn" />
            <svg-icon v-if="form.acceptState === '2'" icon-class="svg-success" />
            <svg-icon v-if="form.acceptState === '3'" icon-class="svg-error" />
            {{ form.acceptStateName || '-' }}
          </div>
        </div>
        <ul v-if="mode === 'view'" class="view-wrapper">
          <li class="view-item">
            <span class="label">事件编码</span>
            <span class="value">{{ form.eventCode || "-" }}</span>
          </li>
          <li class="view-item">
            <span class="label">事件标题</span>
            <span class="value">{{ form.title || "-" }}</span>
          </li>
          <li class="view-item">
            <span class="label">事件类型</span>
            <span class="value ellipsis" :title="eventTypeText">{{ eventTypeText }}</span>
          </li>
          <li class="view-item">
            <span class="label">第三方事件编码</span>
            <span class="value ellipsis" :title="form.uuid">{{ form.uuid || "-" }}</span>
          </li>
          <li class="view-item">
            <span class="label">来源系统</span>
            <span class="value">{{ form.platformSrcName || "-" }}</span>
          </li>
          <li class="view-item">
            <span class="label">第三方事件类型</span>
            <span class="value ellipsis" :title="form.thirdEventTypeName">{{ form.thirdEventTypeName || '-' }}</span>
          </li>
          <li class="view-item">
            <span class="label">事件来源</span>
            <span class="value">{{ form.eventSrcIdName }}</span>
          </li>
          <li class="view-item">
            <span class="label">严重程度</span>
            <span class="value">{{ form.eventUrgentName || "-" }}</span>
          </li>
          <li class="view-item">
            <span class="label">事件上报人</span>
            <span class="value">{{ form.reporterName || "-" }}</span>
          </li>
          <li class="view-item">
            <span class="label">上报人联系方式</span>
            <span class="value">{{ form.reporterMobile || "-" }}</span>
          </li>
          <li class="view-item">
            <span class="label">发生时间</span>
            <span class="value">{{ form.happenTime || "-" }}</span>
          </li>
          <li class="view-item row">
            <span
              class="label"
            >事件描述
              <span v-if="form.invalidEvent === 1" class="tag">疑似无效事件</span>
            </span>
            <span class="value">{{ form.eventDesc }}</span>
          </li>
          <li class="view-item row">
            <span
              class="label"
            >发生地址
              <span v-if="form.invalidAddress === 1" class="tag">无效地址事件</span>
            </span>
            <span class="value">{{ form.eventAddress }}</span>
          </li>

          <event-media :event-media="form.mediaList" />
        </ul>
        <el-form
          v-else
          ref="formRef"
          :model="form"
          :rules="rules"
          inline
          label-position="top"
          :class="['type-in-class']"
        >
          <el-form-item label="发生地址" prop="deptId" class="row">
            <cestc-cascader
              ref="addressRef"
              v-model="form.deptId"
              :options="allGridsNoDisabled"
              clearable
              :props="{
                value: 'id',
                label: 'name',
                emitPath: false,
              }"
            />
          </el-form-item>
          <el-form-item label="详细地址" prop="eventAddress" class="row">
            <el-input v-model="form.eventAddress" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="事件描述" prop="eventDesc" class="row">
            <el-input
              v-model="form.eventDesc"
              type="textarea"
              maxlength="1000"
              :rows="5"
              placeholder="请输入内容"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <!-- 地图 -->
      <div class="right">
        <div v-if="AmapSearch" class="map-action">
          <el-input
            v-model="searchPlaceText"
            placeholder="请输入查询地址"
            @keyup.enter.native="_searchPlace"
          >
            <template slot="append">
              <img
                src="@/assets/search.png"
                class="img"
                alt=""
                @click.stop="_searchPlace"
              >
            </template>
          </el-input>
        </div>
        <!-- map 容器 -->
        <div id="map-address" />
        <!-- 自定义工具栏 -->
        <MapControl @zoomIn="_zoomIn" @zoomOut="_zoomOut" @reset="_reset" />
        <!-- 承载地址搜索集合容器 -->
        <div id="panel" ref="panelRef" />
        <span v-if="showPanelClose" class="el-icon-close" @click.stop="_closePanel" />
      </div>
    </div>
    <div v-if="jumpFrom !== '/workbench/event-focus'" class="footer">
      <!-- 只有待处理状态才有相关操作 -->
      <template v-if="form.acceptState === '1'">
        <el-button
          v-if="mode === 'view'"
          v-loading="loading"
          type="primary"
          @click.stop="_action('accept')"
        >受理</el-button>
        <el-button
          v-else
          v-loading="loading"
          type="primary"
          @click.stop="_action('submit')"
        >提交</el-button>
        <el-button v-if="mode === 'view'" @click.stop="mode = 'edit'">信息补充</el-button>
        <el-button v-if="mode === 'view'" @click.stop="_action('reject')">退回</el-button>
        <el-button v-else @click.stop="_action('reset')">重置</el-button>
      </template>
      <el-button @click.stop="_goback(mode === 'edit' ? 'info' : 'list')">取消</el-button>
    </div>
    <div v-else class="footer">
      <el-button @click.stop="printDetail">打印</el-button>
      <el-button @click.stop="_goback(mode === 'edit' ? 'info' : 'list')">返回</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import leafletMapMixin from "@/mixin/leafletMapMixin";
import orgWktMixin from "@/mixin/orgWktMixin";
import moduleSrv from "@/api/dispatch";
import { SUCCESS_CODE } from "@/constants";
import { mapGetters } from "vuex";
import eventMedia from '@/components/EventInfo/eventMedia.vue'
import Print from '@/utils/print'

export default {
  name: "PreAcceptedInfo",
  mixins: [leafletMapMixin, orgWktMixin],
  components: {eventMedia},
  data() {
    return {
      mode: "view", // 默认是详情模式，只查看
      form: {
        mapcoordinate: window.GLOBAL_CONFIG?.mapcoordinate || "50",
      },
      rules: {
        deptId: [{ required: true, message: "发生地址不能为空", trigger: "blur" }],
        eventAddress: [{ required: true, message: "详细地址不能为空", trigger: "blur" }],
        eventDesc: [{ required: true, message: "事件描述不能为空", trigger: "blur" }],
      },
      loading: false, // 按钮是否可点击
    };
  },
  watch: {
    "form.deptId": {
      handler(val) {
        // 发生地址改变，查询机构面数据
        this.getOrgWkt(val);
      },
    },
  },
  computed: {
    ...mapGetters(["allGridsNoDisabled"]),
    eventId() {
      return this.$route.query.id;
    },
    eventTypeText() {
      let event = this.form
      // 把事件大、中、小类组合
      let eventTypeText = `${event.eventTypeLName || '-'}/${
        event.eventTypeMNAME || '-'
      }/${event.eventTypeName || '-'}/${event.eventTypeIdFourName || ''}/${
        event.eventTypeIdFiveName || ''
      }`
      return eventTypeText.replace(/\/\//, '')
    },
    jumpFrom(){
      return this.$route.query.from
    }
  },
  created() {
    if (this.eventId) {
      this.getDetail();
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // 查询详情
    getDetail() {
      moduleSrv.getPreEventDetail(this.eventId).then((res) => {
        if (res.code === SUCCESS_CODE) {
          Object.keys(res.data || {}).forEach((key) => {
            console.log('key: ', key);
            this.$set(this.form, key, res.data[key]);
          });
          // 坐标类型取自配置
          this.form.mapcoordinate = window.GLOBAL_CONFIG?.mapcoordinate
          // 绘制点
          const { mapcoordinate, gcj02, wgs84, coordx, coordy } = this.form;
          let point;
          if (mapcoordinate === "10" && gcj02) {
            point = gcj02;
          } else if (mapcoordinate === "50" && wgs84) {
            point = wgs84;
          } else {
            point = `POINT(${coordx} ${coordy})`;
          }
          if (point.indexOf("undefined") > -1) return;
          // 对 point 进行转换
          const latlng = this.twoD_map?.parsePointWktReverse(point);
          if (latlng) {
            if (this.eventMarker) this.twoD_map?.removeLayer(this.eventMarker);
            // 纬度在前、经度在后，是因为 leaflet 的 api 决定的
            this.eventMarker = this.twoD_map?.renderMarker(latlng)
            // console.log('latlng==', latlng);
            this.twoD_map.flyToPoint(latlng);
          }
        }
      });
    },
    _action(type) {
      switch (type) {
        case "accept":
          this._accept();
          break;
        case "submit":
          this._submit();
          break;
        case "reject":
          this._reject();
          break;
        case "reset":
          this._reset();
          break;

        default:
          break;
      }
    },
    // 退回
    _reject() {
      this.$confirm("确定要退回该事件吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "cestc-confirm-warning",
      }).then(() => {
        moduleSrv.returnPreEvent({ id: this.form.id }).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message.success(res.message);
            this._goback();
          }
        });
      });
    },
    // 受理
    _accept() {
      // 校验是否有事件坐标，没有则不可以提交
      if (!(this.form.coordx && this.form.coordy)) {
        this.$message.warning("请补充事件地点坐标");
        return;
      }
      moduleSrv.acceptPreEvent({ id: this.form.id }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message.success(res.message);
          this._goback();
        }
      });
    },
    initMap() {
      const that = this;
      if (!this.twoD_map) {
        this.initTwoDMap("map-address");
      }
      this.twoD_map.map.on("click", (e) => {
        if (that.mode === "view") return;
        that.renderMarker(e.latlng);
        that.searchGridDOByLonLat(e.latlng);
      });
    },
    async _reset() {
      await this.$nextTick();
      this.$refs.formRef?.resetFields();
    },
    reseAddress() {
      this.$set(this.form, "deptId", "");
      this.$set(this.form, "coordx", "");
      this.$set(this.form, "coordy", "");
      this.$set(this.form, "eventAddress", "");
      this.orgWkt = "";
      //  清除图层
      setTimeout(() => {
        if (this.eventMarker) this.twoD_map?.removeLayer(this.eventMarker);
      }, 600)
      this.echoWkt("");
    },

    // 提交
    _submit() {
      // 区分是保存、还是提交
      this.$refs["formRef"].validate((valid) => {
        if (valid) {
          // 校验是否有事件坐标，没有则不可以提交
          if (!this.form.coordx || !this.form.coordy) {
            this.$message.warning("请先在地图中进行打点");
            return;
          }
          if (this.loading) return;
          this.loading = true;
          const params = { ...this.form };
          moduleSrv
            .completePreEventInfo(params)
            .then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                });
                this._goback(this.mode === "edit" ? "info" : "list");
              } else {
                this.$message({
                  message: res.message || "操作失败！",
                  type: "error",
                });
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    // 返回列表或上一级
    _goback(where = "list") {
      // where: info 到详情, list 到列表
      // console.log('where==', where);
        if (where === "info") {
          this.mode = "view";
          this.getDetail();
        } else {
          if(this.jumpFrom) {
            // this.$router.go(-1)
            this.$router.push({
              path: this.jumpFrom
            });
          return
        }else{
            this.$router.push({
            path: "/event/pre-accepted",
          });
        }
      }
    },
    printDetail(){
      this.$nextTick(() => {
        const eventInfoHtml = document.getElementsByClassName('page-wrapper')[0]
        Print(eventInfoHtml)
      })
    }
  },
};
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .content {
    padding: 20px 20px 0;
    flex: 1;
    display: flex;
    overflow-y: auto;
    .left {
      width: 650px;
      padding-right: 20px;
      position: relative;
      @include info;
      .label {
        .tag {
          background-color: #ffeedc;
          color: #fa8b16;
          font-size: 12px;
          padding: 3px 5px;
          border-radius: 3px;
        }
      }
      .event-head {
        display: flex;
        margin-bottom: 20px;
        .e-state {
          margin-left: 8px;
          height: 24px;
          background: rgba(250,139,22,0.15);
          border-radius: 2px;
          color: #FA8B16;
          line-height: 24px;
          padding: 0 4px;
          &-2{
            color: #4CC09E;
            background: rgba(76,192,158,0.15);
          }
          &-3{
            color: #FF4D4F;
            background: rgba(255,77,79,0.15);
          }
        }
      }
      .el-form-item {
        width: calc(50% - 10px);
        margin-right: 20px;
        ::v-deep {
          .el-cascader,
          .cestc-date-picker,
          .el-date-editor,
          .el-select {
            // 修复上级事件类型样式问题
            width: 100%;
          }
        }
        &:nth-child(2n) {
          margin-right: 0;
        }
        &.row {
          width: 100%;
        }
        .upload-trigger {
          display: flex;
        }
        .upload_tips {
          cursor: initial;
          color: #bdbdbd;
        }
        .el-upload-list {
          display: flex;
        }
      }
    }
    .right {
      flex: 1;
      position: relative;
      .map-action {
        position: absolute;
        left: 20px;
        top: 20px;
        width: 100%;
        z-index: 1000;
        .el-input {
          width: 400px;
        }
        ::v-deep .el-input-group__append {
          width: 32px;
          height: 32px;
          background: #f9fafe;
          border-radius: 0px 2px 2px 0px;
          border: 1px solid #e7e7e7;
          border-left: none;
          padding: 0;
          text-align: center;
          cursor: pointer;
          .img {
            width: 16px;
            height: 16px;
          }
        }
      }
      #panel {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2000;
        max-width: 50%;
        ::v-deep {
          .amap_lib_placeSearch .amap_lib_placeSearch_list {
            padding-right: 15px;
          }
        }
      }
      .el-icon-close {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2100;
        font-size: 20px;
        cursor: pointer;
      }
      #map-address {
        width: 100%;
        height: 100%;
      }
    }
  }
  .footer {
    height: 64px;
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
}
</style>
