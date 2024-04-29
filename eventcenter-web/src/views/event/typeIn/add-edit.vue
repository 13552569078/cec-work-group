<!--
@Author: lism
@Description: 事件录入或编辑
@Date: 2023-11-13
-->
<template>
  <div class="page-wrapper">
    <div class="content">
      <div class="left">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          inline
          label-position="top"
          :class="['type-in-class']"
        >
          <el-form-item label="事件标题" prop="title" class="row">
            <el-input v-model="form.title" placeholder="请输入" maxlength="50" />
          </el-form-item>
          <el-form-item label="事件来源" prop="eventSrcId">
            <el-select v-model="form.eventSrcId" placeholder="请选择">
              <el-option
                v-for="(item, index) in eventSourceOptions"
                :key="item.id || index"
                :label="item.dictDesc"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="事件类型" prop="eventTypeLId" class="mr0">
            <event-type-cascader
              ref="cascader"
              :disable-forbidden="true"
              :parent-type.sync="form.eventTypeLId"
              :middle-type.sync="form.eventTypeMId"
              :child-type.sync="form.eventTypeId"
              :event-type-id-four.sync="form.eventTypeIdFour"
              :event-type-id-five.sync="form.eventTypeIdFive"
            />
          </el-form-item>
          <el-form-item label="严重程度" prop="eventUrgent">
            <el-select v-model="form.eventUrgent" placeholder="请选择">
              <el-option
                v-for="(item, index) in eventUrgentOptions"
                :key="item.id || index"
                :label="item.dictDesc"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发生时间" prop="happenTime" class="mr0">
            <cestc-date-picker
              v-model="form.happenTime"
              type="datetime"
              placeholder="请选择"
              :append-to-body="false"
              now-flag
              clearable
            />
          </el-form-item>
          <el-form-item label="发生地址" prop="deptId" class="row">
            <cestc-cascader
              ref="addressRef"
              v-model="form.deptId"
              :options="allGridsNoDisabled"
              clearable
              :props="{
                value: 'id',
                label: 'name',
                emitPath: false
              }"
            />
          </el-form-item>
          <el-form-item label="" prop="eventAddress" class="row">
            <el-input v-model="form.eventAddress" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="事件上报人" prop="reporterName" style="margin-right: 20px">
            <el-input v-model="form.reporterName" placeholder="请输入" maxlength="50" />
          </el-form-item>
          <el-form-item
            label="上报人联系方式"
            prop="reporterMobile"
            style="margin-right: 0"
          >
            <el-input v-model="form.reporterMobile" placeholder="请输入" />
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
          <el-form-item label="事件多媒体文件" class="row">
            <cestc-upload-card
              accept="video/*,image/*,audio/*"
              :media-list="form.eventMediaList"
              :limit="9"
              limit-size="100"
              @fileList="_eventMedia"
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
    <div class="footer">
      <el-button
        v-loading="loading"
        type="primary"
        @click.stop="_confirm('submit')"
      >提交</el-button>
      <el-button v-loading="loading" @click.stop="_confirm('save')">保存</el-button>
      <el-button @click.stop="_goback">取消</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import eventTypeCascader from "../components/EventTypeCascader";
import leafletMapMixin from "@/mixin/leafletMapMixin";
import orgWktMixin from "@/mixin/orgWktMixin";
import moduleSrv from "@/api/dispatch";
import { validPhone } from "@/utils/validate";
import { SUCCESS_CODE } from "@/constants";
import { mapGetters } from "vuex";

const _validPhone = (rule, value, callback) => {
  if (validPhone(value)) {
    callback();
  } else {
    callback(new Error("手机号码格式错误"));
  }
};

export default {
  name: "EventTypeAddEdit",
  components: {
    eventTypeCascader,
  },
  mixins: [leafletMapMixin, orgWktMixin],
  data() {
    const _validEventTypeId = (_rule, _value, callback) => {
      const {eventTypeIdFive, eventTypeIdFour, eventTypeId, eventTypeMId, eventTypeLId} = this.form
      let target = eventTypeIdFive || eventTypeIdFour || eventTypeId || eventTypeMId || eventTypeLId
        if (target) {
          callback();
        } else {
          callback(new Error("不能为空"));
        }
      };
    return {
      form: {
        eventMediaList: [], // 必须有
        mapcoordinate: window.GLOBAL_CONFIG?.mapcoordinate || "50",
      },
      rules: {
        title: [{ required: true, message: "不能为空", trigger: "blur" }],
        eventSrcId: [{ required: true, message: "事件来源不能为空", trigger: "blur" }],
        eventTypeLId: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: _validEventTypeId, trigger: "blur" },
        ],
        eventUrgent: [{ required: true, message: "紧急程度不能为空", trigger: "blur" }],
        deptId: [{ required: true, message: "发生地址不能为空", trigger: "blur" }],
        eventAddress: [{ required: true, message: "详细地址不能为空", trigger: "blur" }],
        happenTime: [{ required: true, message: "不能为空", trigger: "blur" }],
        reporterName: [{ required: true, message: "上报人不能为空", trigger: "blur" }],
        reporterMobile: [
          { required: true, message: "联系方式不能为空", trigger: "blur" },
          { validator: _validPhone, trigger: "blur" },
        ],
        eventDesc: [{ required: true, message: "事件描述不能为空", trigger: "blur" }],
      },
      loading: false, // 按钮是否可点击
      markerLatLng: "", // 坐标
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
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType("event_origin");
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType("event_urgent_level");
    },
    eventId() {
      return this.$route.query.id;
    },
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
      moduleSrv.getEventDetail(this.eventId).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const { media = [], event = {} } = res.data;
          Object.keys(event).forEach((key) => {
            this.$set(this.form, key, event[key]);
          });
          // 多媒体单独赋值
          this.$set(this.form, "eventMediaList", media);
          // 根据配置，决定使用什么坐标点位
          const { coordx = null, coordy = null, gcj02, wgs84 } = event;
          let point;
          if (window.GLOBAL_CONFIG.mapcoordinate === "10" && gcj02) {
            point = gcj02;
          } else if (window.GLOBAL_CONFIG.mapcoordinate === "50" && wgs84) {
            point = wgs84;
          } else {
            point = `POINT(${coordx} ${coordy})`;
          }
          // 对 point 进行转换
          const latlng = this.twoD_map?.parsePointWktReverse(point);
          this.renderMarker({
            lng: latlng[1], // 经度
            lat: latlng[0],
          });
        }
      });
    },
    initMap() {
      const that = this;
      if (!this.twoD_map) {
        this.initTwoDMap("map-address");
      }
      this.twoD_map.map.on("click", (e) => {
        console.log('map--click==', e);
        that.renderMarker(e?.latlng);
        that.searchGridDOByLonLat(e?.latlng);
      });
    },

    reseAddress() {
      this.$set(this.form, "deptId", "");
      this.$set(this.form, "coordx", "");
      this.$set(this.form, "coordy", "");
      this.$set(this.form, "eventAddress", "");
      this.markerLatLng = "";
      this.orgWkt = "";
      //  清除图层
      this.echoWkt("");
    },

    chaochufiles() {
      this.$message({
        message: "最多上传9张图片",
        type: "error",
      });
    },
    // 图片上传列表
    _eventMedia(fileList) {
      // 每次修改都对 form 表单进行更新
      this.form.eventMediaList = fileList;
    },
    // 确认按钮触发
    _confirm(flag) {
      // 区分是保存、还是提交
      this.$refs["form"].validate((valid) => {
        // 如果是编辑状态，把 id 添加
        if (this.eventId) {
          this.form.id = this.eventId;
        }
        if (valid) {
          // 如果没有打点，则不进行提交
          if (!this.form.coordx || !this.form.coordy) {
            this.$message.warning('请先在地图中进行打点')
            return
          }
          if (this.loading) return;
          this.loading = true;
          const params = { ...this.form };
          let _handle;
          if (flag === "submit") {
            // 提交
            _handle = moduleSrv.submitEvent;
          } else {
            // 保存
            _handle = moduleSrv.saveEvent;
          }
          _handle(params)
            .then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                });
                this._goback();
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
    _goback() {
      const speType = this.$route.query.speType
      let queryP = {refresh: true}
      if (speType) queryP.speType = speType
      this.$router.push({
        path: "/event/type-in",
        query: queryP
      });
    },
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
    height: calc(100% - 64px);
    display: flex;
    .left {
      width: 650px;
      padding-right: 20px;
      overflow-y: auto;
      .cestc-upload {
        max-width: 600px;
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
        &.mr0 {
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
        z-index: 2000;
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
            margin-top: 4px;
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
