<template>
  <general-table ref="tableRef" :title="TITLE" :code="CODE"> </general-table>
</template>

<script lang="ts" setup>
import GeneralTable from "../general-table.vue";

const TITLE = "体育场馆";
const CODE = "DisasterSocialStadium";
</script>
