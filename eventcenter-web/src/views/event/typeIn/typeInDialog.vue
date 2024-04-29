<!--
 * @description 事件录入新增、编辑弹窗
 * @date 2020-08-24
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle"
    :width="dialogWidth"
    top="10vh"
    v-on="$listeners"
  >
    <div class="content-wrapper">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        inline
        label-position="top"
        :class="['type-in-class', {'view-map': viewMap}]"
      >
        <el-form-item label="事件来源" prop="eventSrcId">
          <el-select
            v-model="form.eventSrcId"
            placeholder="请选择"
            :disabled="dialogMode === 'view'"
          >
            <el-option
              v-for="(item, index) in eventSourceOptions"
              :key="item.id || index"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事件类型" prop="eventTypeId">
          <event-type-cascader
            ref="cascader"
            :disable-forbidden="true"
            :child-type.sync="form.eventTypeId"
            :parent-type.sync="form.eventTypeLId"
            :middle-type.sync="form.eventTypeMId"
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>
        <el-form-item label="上报人" prop="reporterName">
          <el-input
            v-model="form.reporterName"
            placeholder="请输入内容"
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="reporterMobile">
          <el-input
            v-model="form.reporterMobile"
            placeholder="请输入内容"
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>
        <el-form-item label="发生地址" prop="deptId" class="item-row">
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
        <el-form-item class="item-row" prop="eventAddress">
          <div class="eventAddress">
            <el-input
              v-model="form.eventAddress"
              placeholder="请输入详细地址"
              :disabled="dialogMode === 'view'"
            />
            <el-input
              v-if="markerLatLng"
              v-model="markerLatLng"
              :disabled="dialogMode === 'view'"
              class="ml10"
            />
            <!-- 添加地图 icon ，支持地图选点 -->
            <i class="el-icon-map-location" @click.stop="troggleMap" />
          </div>
        </el-form-item>
        <el-form-item label="紧急程度" prop="eventUrgent">
          <el-select
            v-model="form.eventUrgent"
            placeholder="请选择"
            :disabled="dialogMode === 'view'"
          >
            <el-option
              v-for="(item, index) in eventUrgentOptions"
              :key="item.id || index"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="事件描述" prop="eventDesc" class="item-row">
          <el-input
            v-model="form.eventDesc"
            type="textarea"
            maxlength="1000"
            :rows="5"
            placeholder="请输入内容"
            show-word-limit
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>
        <el-form-item label="事件多媒体文件" class="item-row">
          <cestc-upload
            ref="upload"
            :limit="9"
            limit-size="20"
            accept="image/*"
            only-img
            :on-exceed="chaochufiles"
            :media-list="form.eventMediaList"
            @eventMedia="_eventMedia"
          />
        </el-form-item>
      </el-form>
      <!-- 地图选点 -->
      <div v-show="viewMap" class="map-wrapper">
        <div v-if="AmapSearch" class="map-action">
          <el-input v-model="searchPlaceText" placeholder="请输入查询地址" @keyup.enter.native="_searchPlace">
            <template slot="append">
              <img src="@/assets/search.png" class="img" alt="" @click.stop="_searchPlace">
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
    <!-- 自定义操作按钮 -->
    <div slot="footer">
      <el-button @click.stop="_cancle">取消</el-button>
      <el-button
        v-if="dialogMode !== 'view'"
        v-loading="loading"
        @click.stop="_confirm('save')"
      >保存</el-button>
      <el-button
        v-if="dialogMode !== 'view'"
        v-loading="loading"
        type="primary"
        @click.stop="_confirm('submit')"
      >提交</el-button>
    </div>
  </cestc-dialog>
</template>
<script>
/* eslint-disable */
import eventTypeCascader from '../components/EventTypeCascader';
import leafletMapMixin from '@/mixin/leafletMapMixin';
import moduleSrv from '@/api/dispatch';
import { validPhone } from '@/utils/validate';
import { mapActions, mapGetters } from 'vuex';
import { SUCCESS_CODE } from '@/constants';

const _validPhone = (rule, value, callback) => {
  if (validPhone(value)) {
    callback();
  } else {
    callback(new Error('手机号码格式错误'));
  }
};

export default {
  name: 'TypeInDialog',
  components: {
    eventTypeCascader,
  },
  mixins: [leafletMapMixin],
  data() {
    return {
      form: {
        eventMediaList: [], // 必须有
        mapcoordinate: window.GLOBAL_CONFIG?.mapcoordinate || '50'
      },
      orgWkt: '', // 机构网格数据
      orgLayer: null, // 机构图层
      loading: false, // 按钮是否可点击
      eventTypeLId: '',
      eventTypeMId: '',
      rules: {
        eventSrcId: [
          { required: true, message: '事件来源不能为空', trigger: 'blur' },
        ],
        eventTypeId: [
          { required: true, message: '事件类型不能为空', trigger: 'blur' },
        ],
        eventUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'blur' },
        ],
        deptId: [
          { required: true, message: '发生地址不能为空', trigger: 'blur' },
        ],
        eventAddress: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' },
        ],
        reporterName: [
          { required: true, message: '上报人不能为空', trigger: 'blur' },
        ],
        reporterMobile: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { validator: _validPhone, trigger: 'blur' },
        ],
        eventDesc: [
          { required: true, message: '事件描述不能为空', trigger: 'blur' },
        ],
      },
      viewMap: false,
      eventMarker: null, // 事件点位
      relMarker: null, // 关联对象点位
      markerLatLng: '', // 坐标
      AmapSearch: window.GLOBAL_CONFIG.erwei.AmapSearch || false, // 是否显示地址搜索服务
      searchPlaceText: '',
      placeSearch: null,
      showPanelClose: false,
    };
  },
  computed: {
    ...mapGetters(['allGridsNoDisabled']),
    dialogWidth() {
      return this.viewMap ? '1284px' : '684px';
    },
    dialogMode() {
      return this.$attrs.mode || 'add';
    },
    matchTitle() {
      const key = this.dialogMode;
      const obj = {
        add: '新增事件录入',
        edit: '修改事件录入',
        view: '事件录入详情',
      };
      return obj[key];
    },

    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_platform');
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_origin');
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level');
    },
    noPlatformSrc() {
      return this.form.platformSrc ? false : true;
    }
  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': {
      // immediate: true,
      async handler(val) {
        await this.$nextTick()
        if (!val) {
        // 关闭
        this.$refs['form'].resetFields();
        this.form = {};
        this.form.deptId = '';
        this.eventTypeLId = '';
        this.eventTypeMId = '';
        this.cityId = '';
        this.areaId = '';
        this.streetId = '';
        this.communityId = '';
        this.viewMap = false;
        this.markerLatLng = '';
        // this.twoD_map= null
        this.searchPlaceText=''
        // 清空图片列表
        this.$refs.upload.clearFile();
        // 清空事件类型数据
        this.$refs.cascader.eventType = []
        // 清空地图点位信息
        if (this.eventMarker) this.twoD_map.removeLayer(this.eventMarker);
      } else {
        // 打开
        this.updateForm();
        if (!this.viewMap) {
          this.troggleMap()
        }
      }
      },
      immediate: true,
      deep: true
    },
    'form.deptId': {
      deep: true,
      async handler(val) {
        await this.$nextTick()
        if (val) {
          // 匹配到该节点，找到对应的 wkt 数据
          const addressRef = this.$refs.addressRef?.$refs?.cascaderRef
          const node = addressRef.getCheckedNodes()
          if (node && node.length) {
            this.orgWkt =  node[0]?.data?.geom
            // 更新 panel 面板数据
            this.$set(addressRef.$refs.panel, 'activePath', node[0].pathNodes)
            addressRef.$refs.panel.syncActivePath()
          }
        }
      }
    },
    orgWkt: {
      deep: true,
      handler(val) {
        this.echoWkt(val)
      }
    },
    
  },
  created() {
    this.getEventTypeHiddenDisabled({ status: 0 })
  },
  methods: {
    ...mapActions('dispatch', ['getEventTypeHiddenDisabled']),
    
    // 绘制机构
    echoWkt(wkt) {
      if (this.orgLayer) {
        this.twoD_map.removeLayer(this.orgLayer)
      }
      let color =  '#4caf50'
      if (!wkt) return
      this.orgLayer = this.twoD_map.renderGeoJsonByWkt(
        wkt,
        {
          layerID: 'orgLayer',
        },
        {
          style: {
            color,
            fillColor: color,
            fillOpacity: 0.5,
          },
        }
      );
      this.twoD_map.flyToBounds(this.orgLayer.getBounds());
    },
    // 判断是否显示 panel 关闭按钮
    async hasPanelClose() {
      await this.$nextTick()
      const _el = this.$refs.panelRef
      this.showPanelClose = _el.children?.length
    },
    _closePanel() {
      this.placeSearch && this.placeSearch.clear()
      this.showPanelClose = false
    },
    // 地点搜索
    _searchPlace() {
      const that = this;
      if (!this.searchPlaceText) {
        // 如果搜索地址为空，则清空查询项
        let _el = this.$refs.panelRef
        _el.removeChild(_el.children[0])
        return
      }
      AMap.service(["AMap.PlaceSearch"], function() {
        //构造地点查询类
        let placeSearch = new AMap.PlaceSearch({
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: window.GLOBAL_CONFIG.erwei.city || '全国', // 兴趣点城市
            citylimit: true,  //是否强制限制在设置的城市内搜索
            extensions: 'all',
            panel: "panel", // 结果列表将在此容器中进行展
        });
        that.placeSearch = placeSearch
        //关键字查询
        placeSearch.search(that.searchPlaceText, function(status, result) {
          console.log('status==', status);
          that.hasPanelClose()
          if (status !== 'complete') {
            // 列出常年的错误
            const errKeyMap = {
              'SERVICE_NOT_AVAILABLE': '服务不可用',
              'INVALID_USER_KEY': 'key不正确或过期',
              'INVALID_USER_SCODE': '安全码未通过验证',
              'INVALID_USER_DOMAIN': '绑定域名无效',
              'USERKEY_PLAT_NOMATCH': '请求key与绑定平台不符',
              'INSUFFICIENT_PRIVILEGES': '权限不足，服务请求被拒绝',
              'USER_KEY_RECYCLED': 'Key被删除',
              'INVALID_PARAMS': '请求参数非法',
              'UNKNOWN_ERROR': '其他未知错误',
            }
            console.log('result==', result);
            that.$message.warning(errKeyMap[result] || result)
          }
        });
        // poi 面板列表项点击事件注册， markerClick poi 地区对应的 markket 被点击事件
        AMap.event.addListener(placeSearch, "listElementClick", (e) => {
          // 绘制点，更新网格， 更新详情地址
          const {address, location} = e.data
          that.$set(that.form, 'eventAddress', address)
          that.renderMarker(location)
          // 通过定位查询网格
          that.searchGridDOByLonLat(location)
        })
    });
    },
    // 通过点位查询网格
    searchGridDOByLonLat(location) {
      const params = {
        geom:  `POINT(${location.lng} ${location.lat})`,
        mapCoordinate: this.form.mapcoordinate
      }
      moduleSrv.searchGridDOByLonLat(params).then(res => {
        if(res.code === 0){
          if (res.data) {
            this.$set(this.form, 'deptId', res.data.gridId)
              // 飞到指定点
            this.twoD_map.flyToPoint(location)
          }
        } else {
          this.reseAddress()
        }
      }).catch(_err => {
          console.log('通过点位查询网格-searchGridDOByLonLat', _err);
          this.reseAddress()
      })
    },
    reseAddress() {
      this.$set(this.form, 'deptId', '')
      this.$set(this.form, 'coordx', '')
      this.$set(this.form, 'coordy', '')
      this.$set(this.form, 'eventAddress', '')
      this.markerLatLng=''
      this.orgWkt =''
      //  清除图层
      this.echoWkt('')
    },
    // 绘制点位
    renderMarker(latlng, draggable=true) {
      const that = this
      if (this.eventMarker) this.twoD_map.removeLayer(this.eventMarker);
      this.markerLatLng = `${latlng.lat},${latlng.lng}`;
      this.form.coordx = latlng.lng; // 经度
      this.form.coordy = latlng.lat; // 纬度
      // 标记点位
      this.eventMarker = this.twoD_map.renderMarker(
        latlng,
        '',
        {},
        {
          draggable,
          icon: L.icon({
            iconUrl: require('@/assets/marker-icon.png'),
            iconSize: [58, 55],
            iconAnchor: [20, 45],
          }),
        }
      );
      this.twoD_map.registerLayerEvent(
        this.eventMarker,
        'moveend',
        (sub) => {
          that.markerLatLng = `${sub.target._latlng.lat},${sub.target._latlng.lng}`;
          that.form.coordx = sub.target._latlng.lat;
          that.form.coordy = sub.target._latlng.lng;
          // 更新网格信息
          that.searchGridDOByLonLat(sub.target._latlng)
        }
      );
    },
    chaochufiles() {
      this.$message({
        message: '最多上传9张图片',
        type: 'error',
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
      this.$refs['form'].validate((valid) => {
        const mode = this.dialogMode;
        // 如果是编辑状态，把 id 添加
        if (mode === 'edit') {
          this.form.id = this.$attrs.editingdata.id;
        }
        if (valid) {
          if (this.loading) return
          this.loading = true
          const params = { ...this.form };
          let _handle;
          if (flag === 'submit') {
            // 提交
            _handle = moduleSrv.submitEvent;
          } else {
            // 保存
            _handle = moduleSrv.saveEvent;
          }
          _handle(params).then((res) => {
            if (res.code === SUCCESS_CODE) {
              this.$message({
                message: '操作成功！',
                type: 'success',
              });
              this._cancle();
            } else {
              this.$message({
                message: res.message || '操作失败！',
                type: 'error',
              });
            }
          }).finally(() => {
            this.loading = false
          });
        }
      });
    },
    // 更新级联选择数据，修复回显问题
    updateForm() {
      const editData = this.$attrs.editingdata;
      const mode = this.$attrs.mode;
      if (mode !== 'add') {
        // 如果是编辑，需要调用详情接口，获取媒体列表
        moduleSrv.getEventDetail(editData.id).then((res) => {
          if (res.code === SUCCESS_CODE) {
            const { media = [], event = {} } = res.data;
            // 把对象深拷贝到 form
            this.form = JSON.parse(JSON.stringify(event));
             // 回显上传图片
            this.$set(this.form, 'eventMediaList', media);
            Object.keys(event).forEach(key => {
              if (key !== 'eventMediaList') {
                this.$set(this.form, key, event[key])
              }
            })
            // 根据配置，决定使用什么坐标点位

            const {coordx=null,coordy=null, gcj02, wgs84 } = event;
            let point
            if (window.GLOBAL_CONFIG.mapcoordinate === '10' && gcj02) {
              point = gcj02
            } else if(window.GLOBAL_CONFIG.mapcoordinate === '50' && wgs84) {
              point = wgs84
            } else {
              point = `POINT(${coordx} ${coordy})`
            }
            // 对 point 进行转换
            const latlng = this.twoD_map.parsePointWktReverse(point)
            // console.log('latlng==', latlng);
            this.renderMarker({
                lng: latlng[1],// 经度
                lat: latlng[0] ,
              })
          } else {
            console.warn('getEventDetail 接口报错');
          }
        });
      }
    },

    // 地图显示、隐藏切换
    troggleMap() {
      this.viewMap = !this.viewMap;
      const that = this;
      if (this.viewMap) {
        // 地图打开的状态，渲染地图
        this.$nextTick(() => {
          if (!this.twoD_map) {
            this.initTwoDMap('map-address');
          }
          this.twoD_map.map.on('click', (e) => {
            that.renderMarker(e.latlng)
            that.searchGridDOByLonLat(e.latlng)
          });
        });
      }
    },

    // 事件管理
    getEventTypeSelect(data) {
      moduleSrv.eventTypeSelect({ platformSrc: data }).then((res) => {
        if (res) {
          this.$store.commit('dispatch/SET_EVENT_TYPE', res);
        }
      });
    },

    // 取消、关闭弹窗
    _cancle() {
      this.$emit('cancle');
    },
  },
};
</script>
<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  .map-wrapper {
    flex: 0 0 800px;
    border-left: 1px solid #bdbdbd;
    margin: 20px;
    position: relative;
    .map-action {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      z-index: 2000;
      .el-input {
        width: 200px;
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
.type-in-class {
  &.view-map {
    width: calc(100% - 800px);
  }
  .cestc-upload {
    max-width: 600px;
  }
  .el-form-item {
    width: calc(50% - 5px);
    margin-right: 10px;
    .el-cascader,
    .el-select {
      // 修复上级事件类型样式问题
      width: 100%;
    }
    &:nth-child(2n) {
      width: calc(50% - 5px);
      margin-right: 0;
    }
    &.item-row {
      width: 100%;
    }
    & .eventAddress {
      display: flex;
      align-items: center;
      .el-icon-map-location {
        font-size: 20px;
        margin-left: 16px;
        cursor: pointer;
      }
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
</style>
