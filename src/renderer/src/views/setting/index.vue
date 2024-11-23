<template>
  <div class="setting">
    <ElTabs v-model="activeName">
      <ElTabPane label="个人信息" name="personal"><Personal /></ElTabPane>
      <!-- <ElTabPane label="导入资源" name="resource">
        <UploadSource />
      </ElTabPane> -->
    </ElTabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import UploadSource from './UploadSource.vue';
import Personal from './Personal.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const activeName = ref('personal');
watch(
  () => route.query,
  (v: any) => {
    activeName.value = v.name || 'personal';
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.setting {
  padding: 20px;
}
</style>
