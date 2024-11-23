<template>
  <div class="background-lib">
    <Material
      class="material-wrap"
      :directory="backgroundPath"
      :default-display-type="'appstore'"
      @change-directory="(v) => (backgroundPath = v)"
    />
  </div>
</template>

<script setup lang="ts">
import Material from '@renderer/components/Material/index.vue';
import { useAppConfigStore } from '@renderer/store';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
const appConfigStore = useAppConfigStore();
const { resourcePath } = storeToRefs(appConfigStore);
const backgroundPath = ref(resourcePath?.value + '/背景');
</script>
<style lang="scss" scoped>
.background-lib {
  height: 100%;
  padding: 8px 0px;
  .material-wrap {
    height: calc(100% - 10px);
  }
}
</style>
