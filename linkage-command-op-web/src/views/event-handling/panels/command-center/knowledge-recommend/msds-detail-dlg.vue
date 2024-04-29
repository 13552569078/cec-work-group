<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 220)"
    top="18%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="危化品知识详情"
    borderless
    append-to-body
    @closed="$emit('cancel')"
  >
    <hl-scrollbar height="45vh">
      <hl-row layout="grid" class="m-t-lg" count="count-2" gap-x="var(--xxl)" gap-y="var(--lg)">
        <hl-col span="col" v-for="item in labelDataList" :key="item.label">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">{{item.label}}</span>
            <span class="font-bold group-item">{{ item.value }}</span>
          </hl-group>
        </hl-col>
      </hl-row>
    </hl-scrollbar>
  </hl-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { apiKnowledgeRecommendObj } from '@/apis/modules/knowledge-recommend';

const props = defineProps({
  id: String,
});

const items: Record<string, any> = {
  chName1: '化学品中文名称',
  enName1: '化学品英文名称',
  chName2: '化学品俗名',
  enName2: '英文别称',
  // chemicalType: "发生地点",
  chemicalType: '化学类别',
  bookNo: '技术说明书编码',
  casNo: 'casNo',
  // enterprise: "生产企业名称",
  // address: "地址",
  // dangerPic: "危险物质图标",
  // effectDate: "生效日期",
  // msdsElements: "",
  // hazardType: "危险性类别",
  hazardWay: '侵入途径',
  helthHarm: '健康危害',
  envHarm: '环境危害',
  bumsHarm: '燃爆危险',
  skinContact: '皮肤接触',
  eyeContact: '眼睛接触',
  inhalation: '吸入',
  ingestion: '食入',
  dealLeakage: '泄漏应急处理',
  dangerCharacter: '危险特性',
  burnProducts: '有害燃烧产物',
  extinguishMethod: '灭火方法',
  operateAttention: '操作注意事项',
  storeAttention: '储存注意事项',
  // chMac: "中国MAC(mg/m^3)",
  // suMac: "前苏联MAC(mg/m^3)",
  // tlvtn: "TLVTN",
  // tlvwn: "TLVWN",
  monitorMethod: '监测方法',
  engineerControl: '工程控制',
  breathProtect: '呼吸系统防护',
  eyeProtect: '眼睛防护',
  bodyProtect: '身体防护',
  handProtect: '手防护',
  otherProtect: '其它防护',
  appearance: '外观与性状',
  ph: 'PH',
  meltingPoint: '熔点(℃)',
  boilingPoint: '沸点(℃)',
  densityWater: '相对密度(水=1)',
  densitySteam: '相对蒸气密度(空气=1)',
  molecularFormula: '分子式',
  molecularWeight: '分子量',
  mainElement: '主要成分',
  svp: '饱和蒸气压(kPa)',
  burnHeat: '燃烧热(Kj/mol)',
  criticalTem: '临界温度(℃)',
  criticalPressure: '临界压力(MPa)',
  logarithm: '辛醇/水分配系数的对数值',
  flashPoint: '闪点(℃)',
  ignitionTem: '引燃温度（℃）',
  explodeLimit1: '爆炸下限%(V/V)',
  explodeLimit2: '爆炸上限%(V/V)',
  solubleness: '溶解性',
  used: '主要用途',
  msdsFeatures: '其它理化性质',
  stability: '稳定性',
  forbidContent: '禁配物',
  avoidContact: '避免接触的条件',
  aggreHarm: '聚合危害',
  resolveProduct: '分解产物',
  ld50: '急性毒性LD50',
  lc50: '急性毒性LC50',
  subacute: '亚急性和慢性毒性',
  irritating: '刺激性',
  allergenic: '致敏性',
  mutability: '致突变性',
  deformity: '致畸性',
  oncogenicity: '致癌性',
  toxicity: '生态毒理毒性',
  degrade: '生物降解性',
  undegrede: '非生物降解性',
  enrichment: '生物富集或生物积累性',
  otherHarm: '其它有害作用',
  offalQuality: '废弃物性质',
  offalDeal: '废弃处置方法',
  offalAttention: '废弃注意事项',
  goodsNum: '危险货物编号',
  un: 'UN编号',
  packageMark: '包装标志',
  packageType: '包装类别',
  packageMethod: '包装方法',
  transportAttention: '运输注意事项',
  lawInfo: '法规信息',
  reference: '参考文献',
};

const labelDataList = ref<Record<string, any>[]>([]);

const getDetail = async() => {
  const result = await apiKnowledgeRecommendObj.getMSDSDetailById(props.id!);
  Object.keys(items).forEach(k => {
    labelDataList.value.push({ label: items[k], value: result.data[k] || '--' });
  });
};

onMounted(() => {
  getDetail();
});
</script>

<style lang="scss" scoped>
</style>
