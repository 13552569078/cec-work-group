<template>
  <hl-panel class="table-panel h-full">
    <fx-page-table-v2 ref="tableRef" :cols="cols" :table-data="tableData" :search-items="searchItems"
      :data-fetcher="getData">
      <template #action="{ row }">
        <a href="javascript:" @click="handlePlay(row.deviceId)">查看视频</a>
      </template>
    </fx-page-table-v2>
  </hl-panel>
  <video-flv :src="src" :id="deviceCastId"/>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { DataFetcherParams } from "fx-front-framework";
import { apiVideoDataObj } from "@/apis/modules/video";
import { IgetVideoTypeSpace } from "@/apis/modules/video/model";
import VideoFlv from "./video-flv.vue";

const tableData = ref<IgetVideoTypeSpace.List[]>([]);
const cols = ref([
  {
    title: "序号",
    align: "center",
    slotName: "tableIndex",
    prop: "tableIndex",
    width: "4em",
  },
  {
    title: "设备名称",
    prop: "name",
    sortable: true,
    width: "16em",
  },
  { title: "所属机构", prop: "organizationName", width: "16em" },
  { title: "所属区域", prop: "district", width: "16em" },
  { title: "来源", prop: "address", width: "8em" },
  {
    title: "操作",
    slotName: "action",
    width: "8em",
    align: "center",
    fixed: "right",
  },
]);
const searchItems = reactive([
  {
    type: "input",
    label: "设备名称",
    placeholder: "设备名称",
    value: "",
    name: "name",
  }
  // {
  //   type: "select",
  //   label: "行政区划",
  //   placeholder: "行政区划",
  //   clearable: true,
  //   prop: {
  //     label: "dictName",
  //     value: "dictCode",
  //   },
  //   options: [
  //     { dictName: "天宁区", dictCode: 760 },
  //     { dictName: "钟楼区", dictCode: 761 },
  //     { dictName: "新北区", dictCode: 762 },
  //     { dictName: "武进区", dictCode: 763 },
  //     { dictName: "金坛区", dictCode: 764 },
  //     { dictName: "溧阳市", dictCode: 765 },
  //     { dictName: "经开区", dictCode: 766 }
  //   ],
  //   name: "adcode",
  // },
]);

const src = ref("");
const deviceCastId = ref("");

const getData = async ({
  pageSize,
  currentPage,
  params,
  setTotal,
}: DataFetcherParams) => {
  const { data } = await apiVideoDataObj.getFindXFVideoList({
    pageSize,
    pageNum: currentPage,
    ...params,
  });
  tableData.value = data.list;
  setTotal(+data.total);
};

const handlePlay = async (deviceId: string) => {
  const { data } = await apiVideoDataObj.postFindVideoDetail({
    // 河滨东路110号门前
    // "deviceId": "32041108001328258886",
    "deviceId": deviceId,
    "protocol": 0,
    "encode": 0,
    "external": true
  });
  deviceCastId.value = deviceId;
  src.value = data.url;
};
</script>
