<template>
  <div class="lib-tool">
    <ElTabs v-model="activeTool">
      <ElTabPane label="视频解析" name="dsl"><Dsl /></ElTabPane>
      <ElTabPane label="可视化图表" name="chart"><Chart /></ElTabPane>
    </ElTabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Dsl from './Dsl.vue';
import Chart from './Chart.vue';
const activeTool = ref('dsl');
</script>
<style lang="scss" scoped>
.lib-tool {
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
