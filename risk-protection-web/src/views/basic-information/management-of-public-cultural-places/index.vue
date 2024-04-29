<template>
  <general-table ref="tableRef" :title="TITLE" :code="CODE"> </general-table>
</template>

<script lang="ts" setup>
import GeneralTable from "../general-table.vue";

const TITLE = "公共文化场所";
const CODE = "DisasterPublicPlace";
</script>
