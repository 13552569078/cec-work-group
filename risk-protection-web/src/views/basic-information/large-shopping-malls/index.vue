<template>
  <general-table ref="tableRef" :title="TITLE" :code="CODE"> </general-table>
</template>

<script lang="ts" setup>
import GeneralTable from "../general-table.vue";

const TITLE = "大型商场";
const CODE = "DisasterLargeMarket";
</script>
